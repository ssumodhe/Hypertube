const fs = require('fs');
const parseTorrent = require('parse-torrent');
const app = require('express')();
const ffmpeg = require('fluent-ffmpeg');
const torrentStream = require('torrent-stream');
const https = require('http');
const bs58 = require('bs58');

if (!fs.existsSync('torrents')) {
	fs.mkdirSync('torrents');
}

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

const streamVideo = (req, res, n) => {
	return new Promise((resolve, reject)=>{
		try {
			console.log('start streaming');
			req.params.path = bs58.decode(req.params.path).toString('ascii');
			console.log('path:', req.params.path);
			const fileStream = fs.createReadStream(req.params.path);
			const converter = ffmpeg()
			.input(fileStream)
			.outputOptions('-movflags frag_keyframe+empty_moov')
			.outputFormat('mp4')
			.output(res)

			.on('codecData', (codecData) => {
				console.log('fluent-ffmpeg Notice: CodecData:', codecData);
			})
			.on('start', (cmd) => {})
			.on('progress', (progress) => {})
			.on('error', (err, stdout, stderr) => {
				console.log('ffmpeg error');
				resolve(null);
			});

			// if (fileExtension === '.mkv') {
			// 	converter.addOption('-vcodec')
			// 	.addOption('copy')
			// 	.addOption('-acodec')
			// 	.addOption('copy')
			// 	.run();
			// } else {
			converter//.inputFormat('avi'/*fileExtension.substr(1)*/)
			.audioCodec('aac')
			.videoCodec('libx264')
			.run();
			// res.sendStatus(200);
			// }
			res.on('close', () => {
				console.log('stream closed');
				converter.kill();
			});
		} catch (e) {
			console.log('error, try again ...');
			// setTimeout(()=>{
			// 	streamVideo(req, res, n+1);
			// }, 1000)
			resolve(null);
		}
	});
}

const sendHtml = (res, downloadPath, torrentParsed)=>{
	const url = downloadPath+'/'+(torrentParsed.files.sort((a, b)=>{return b.length - a.length}))[0].name;

	res.writeHead(200);
	res.write(`<html><body><video controls width="400px" autoplay onerror="console.log('error video');return 0;"><source src="http://localhost:5555/video/${bs58.encode(Buffer.from(url))}" type="video/mp4" onerror="console.log('error source');return 0;"></video></body>
	</html>`);
	res.end();
	return 0;
}

/*
:url is the file path base58 encoded,
need to change that into an unguessable token linked to the movie and the user who asked it
*/
app.get('/url/:url', (req, res)=>{
	if (!/^[a-km-zA-HJ-NP-Z1-9]{1,}$/.test(req.params.url)) {
		res.sendStatus(404);
		res.end();
		return 0;
	}
	const url = bs58.decode(req.params.url).toString('ascii');

	getFile(url, (err, file) => {
		if (err) {
			throw new Error(err);
		}
		const torrentRaw = file;
		const torrentParsed = parseTorrent(torrentRaw);
		const torrentFilename = torrentParsed.infoHash+'.torrent';
		const torrentPath = 'torrents/'+torrentFilename;
		const downloadPath = process.env.HYPERTUBE_DOWNLOAD_PATH+'/'+torrentParsed.infoHash
		fs.writeFileSync(torrentPath, file);
		const torrent = file;
		console.log('getfile done');
		console.log('error:',err);

		if (!fs.existsSync(downloadPath)) {
			fs.mkdirSync(downloadPath);
		}
		/* Handle if file has been already downloaded ------------------------*/
		if (fs.existsSync(downloadPath+'/'+torrentParsed.files.sort((a, b)=>{return b.length - a.length})[0].name)) {
			sendHtml(res, downloadPath, torrentParsed);
		} else {
			const engine = torrentStream(torrentRaw);
			let path = ""
			let i = 0;
			engine.on('ready', function() {
				engine.files.forEach(function(file) {
					console.log('filename:', file.name);
					var stream = file.createReadStream();
					stream.on('data', (d)=>{
						i++;
						console.log('data:', i, file.name);
						fs.appendFileSync(downloadPath+'/'+file.name, d);
					})
					.on('end', () => {
						console.log('download done:', file.name);
					});
				});
			});
			setTimeout(()=>{
				sendHtml(res, downloadPath, torrentParsed);
			}, 10000);
		}
	});

})
.get('/video/:path', (req, res) => {
	streamVideo(req, res, 0).then(r=>{});
});
app.listen(5555);
