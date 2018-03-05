const fs = require('fs');
const parseTorrent = require('parse-torrent');
const app = require('express')();
const ffmpeg = require('fluent-ffmpeg');
const torrentStream = require('torrent-stream');
const https = require('http');
const bs58 = require('bs58');
const Hypertube = new (require('./Hypertube.class.js'))();

let MIN_SIZE = 100 * 1024 * 1024; // 100 Mo

try {
	fs.mkdirSync('torrents');
	fs.mkdirSync(process.env.HYPERTUBE_DOWNLOAD_PATH);
} catch (e) {}

const getFile = (url, callback) => {
	https.get(url, res => {
		// Initialise an array
		const bufs = [];

		// Add the data to the buffer collection
		res.on('data', (chunk) => {
			bufs.push(chunk)
		});

		// This signifies the end of a request
		res.on('end', () => {
			// We can join all of the 'chunks' of the image together
			const data = Buffer.concat(bufs);

			// Then we can call our callback.
			callback(null, data);
		});
	})
	// Inform the callback of the error.
	.on('error', callback);
}

const streamVideo = async (req, res, ret) => {
	const body = JSON.parse(ret.body);
	return new Promise((resolve, reject)=>{
		try {
			console.log('start streaming');
			// req.params.path = bs58.decode(req.params.token).toString('ascii');
			console.log('token:', req.params.token);
			const path = process.env.HYPERTUBE_DOWNLOAD_PATH + '/' + body.path + '/' + body.title
			console.log('path:', path);
			const fileStream = fs.createReadStream(path);
			const converter = ffmpeg()
			.input(fileStream)
			.outputOptions('-movflags frag_keyframe+empty_moov')
			.outputFormat('mp4')
			.videoBitrate(512, true)
			.output(res)

			.on('error', (err, stdout, stderr) => {
				console.log('ffmpeg error:', err);
				resolve(null);
			});

			converter
			.audioCodec('aac')
			.videoCodec('libx264')
			.run();
			res.on('close', () => {
				console.log('stream closed');
				converter.kill();
			});
		} catch (e) {
			console.log('error streamVideo:', e);
			resolve(null);
		}
	});
}

const sendHtml = (res, downloadPath, torrentParsed)=>{
	const title = (torrentParsed.files.sort((a, b)=>{return b.length - a.length}))[0].name;
	const url = downloadPath+'/'+title;
	try {
		res.writeHead(200);
		res.write(`<html><head><meta charset="utf-8"></head><body><video controls width="400px" autoplay onerror="console.log('error video');return 0;"><source src="http://${process.env.HYPERTUBE_STREAMING_URL}/video/${torrentParsed.infoHash}" type="video/mp4" onerror="console.log('error source');return 0;"></video></body>
		</html>`);
		res.end();
	} catch(e) {
		console.log('sendHtml catch:', e);
	}
}

/*
:url is the file path base58 encoded,
need to change that into an unguessable token linked to the movie and the user who asked it
*/

app.get('/url/:url', (req, res)=>{
	/* Check if url is a valid base58 ----------------------------------------*/
	if (!/^[a-km-zA-HJ-NP-Z1-9]{1,}$/.test(req.params.url)) {
		res.sendStatus(404);
		res.end();
		return 0;
	}
	const url = bs58.decode(req.params.url).toString('ascii');

	getFile(url, async (err, file) => {
		if (err) { throw new Error(err); }
		const torrentRaw = file;
		const torrentParsed = parseTorrent(torrentRaw);
		const torrentFilename = torrentParsed.infoHash+'.torrent';
		const torrentPath = 'torrents/'+torrentFilename;
		const downloadPath = process.env.HYPERTUBE_DOWNLOAD_PATH+'/'+torrentParsed.infoHash
		try {
			fs.writeFileSync(torrentPath, file);
			const torrent = file;
			console.log('getfile done');
			try {
				fs.mkdirSync(downloadPath);
			} catch (e) {}

			try {
				const ret = await Hypertube.get(torrentParsed.infoHash);
				if ((ret.statusCode == 200 || ret.statusCode == 201) && fs.existsSync(downloadPath+'/'+torrentParsed.files.sort((a, b)=>{return b.length - a.length})[0].name)) {
					console.log('file already downloaded');
					sendHtml(res, downloadPath, torrentParsed);
				} else {
					console.log('unknown file, start downloading');
					const engine = torrentStream(torrentRaw);
					const piecesNumber = torrentParsed.pieces.length;
					let path = ""
					let i = 0;

					/* Start torrent-stream engine, create readStream for each files and start downloading */
					engine.on('ready', function() {
						engine.files.forEach(function(file) {
							console.log('filename:', file.name);
							var stream = file.createReadStream();
							stream.on('data', (d)=>{
								i++;
								if (!(i % 100)) console.log('data:', i, '/', piecesNumber, file.name);
								fs.appendFileSync(downloadPath+'/'+file.name, d);
							})
							.on('end', () => {
								console.log('download done:', file.name);
							});
						});
					});

					/* Add the new file in db, set MIN_SIZE downloaded file that trigger the stream */
					const t = torrentParsed.files.sort((a, b)=>{return b.length - a.length})[0];
					Hypertube.post(t.name, torrentParsed.infoHash, torrentParsed.infoHash)
					.then(r => {
						MIN_SIZE = t.length * 0.1;
						console.log("min size:", MIN_SIZE);
						const interval = setInterval(()=>{
							if (fs.existsSync(downloadPath+'/'+t.name)) {
								console.log('size:', fs.statSync(downloadPath+'/'+t.name).size);
								if (fs.statSync(downloadPath+'/'+t.name).size > MIN_SIZE) {
									clearInterval(interval);
									sendHtml(res, downloadPath, torrentParsed);
								}
							}
						}, 1000);
					}).catch(e => {
						console.log('error Hypertube.post:',e);
						res.sendStatus(500);
						res.send();
					})
				}
			} catch (e) {
				console.log('error: check env variables');
				res.sendStatus(500);
				res.send();
			}
		} catch (e) {
			console.log('write file error: chmod 0000 on download path or torrents path?');
			res.sendStatus(500);
		}
	});
})
.get('/video/:token', (req, res) => {
	const exists = (async () => {
		try {
			const ret = await Hypertube.get(req.params.token);
			streamVideo(req, res, ret).then(r=>{});
		} catch(e) {
			res.sendStatus(404);
			res.end();
		}
	})();
});
app.listen(5555);
