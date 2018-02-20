/*
HOW TO RUN ME:
	- export HYPERTUBE_DOWNLOAD_PATH="torrent/download/path"
	- npm install
	- node stream.js
	- convert a torrent url in base58,
		exemple: http://www.torrent9.red/get_torrent/one-piece-813-vostfr.torrent => 368La1fSsTuDRmRXWaN3iJKdbZhPFtyVwETwbK8rZgHJZKbeT4Uu12MvJ2AmC3nPf8SkoVGadFvezhpJ9MAwvToR

	- go to http://localhost:5555/url/368La1fSsTuDRmRXWaN3iJKdbZhPFtyVwETwbK8rZgHJZKbeT4Uu12MvJ2AmC3nPf8SkoVGadFvezhpJ9MAwvToR
	- wait 10 seconds (video is in autoplay mod)

	TODO:
		Handle non downloading torrents :3
*/

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

const sendStream = (res, downloadPath, torrentParsed)=>{
	res.writeHead(200);
	res.write(`<html><body><video controls width="400px" autoplay onerror="console.log('error video');return 0;"><source src="http://localhost:5555/video/${bs58.encode(Buffer.from(downloadPath+'/'+(torrentParsed.files.sort((a, b)=>{return b.length - a.length}))[0].name))}" type="video/mp4" onerror="console.log('error source');return 0;"></video></body>
	</html>`);
	res.end();
	return 0;
}

app.get('/url/:url', (req, res)=>{
	const url = bs58.decode(req.params.url).toString('ascii');
	// console.log('url:',url);

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
			console.log('tt');
			sendStream(res, downloadPath, torrentParsed);
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
				sendStream(res, downloadPath, torrentParsed);
			}, 10000);
		}
	});

})
.get('/video/:path', (req, res) => {
	streamVideo(req, res, 0).then(r=>{});
});
app.listen(5555);
