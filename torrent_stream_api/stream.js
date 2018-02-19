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

app.get('/url/:url', (req, res)=>{
	const url = bs58.decode(req.params.url).toString('ascii');
	console.log('url:',url);

	// request.get(url, (err, response, body)=>{
	// console.log('error:',err);
	// console.log('response:',response);
	// console.log('body:',body);
	// const filename = `${Date.now()}`;
	getFile(url, (err, file) => {
		// console.log(data);
		// fs.writeFileSync('2', data);
		// Handle the error if there was an error getting the image.
		// console.log(parseTorrent(file));
		// process.exit(0);
		if (err) {
			throw new Error(err);
		}
		const torrentRaw = file;
		const torrentParsed = parseTorrent(torrentRaw);
		const torrentFilename = torrentParsed.infoHash;
		const torrentPath = 'torrents/'+torrentFilename;
		fs.writeFileSync('torrents/'+torrentFilename, file);
		const torrent = file;
		console.log('getfile done');
		console.log('error:',err);
		const engine = torrentStream(torrentRaw);
		let path = ""
		// if (torrentParsed.name != (torrentParsed.files.sort((a, b)=>{return b.length - a.length}))[0].name) {
		// 	path = process.env.HYPERTUBE_DOWNLOAD_PATH+'/'+torrentFilename+'/'+torrentParsed.name+'/'+`${(torrentParsed.files.sort((a, b)=>{return b.length - a.length}))[0].name}`;
		// } else {
			path = process.env.HYPERTUBE_DOWNLOAD_PATH+'/'+torrentFilename+'/'+`${(torrentParsed.files.sort((a, b)=>{return b.length - a.length}))[0].name}`;
		// }
		let i = 0;
		if (!fs.existsSync(process.env.HYPERTUBE_DOWNLOAD_PATH+'/'+torrentFilename)) {
			fs.mkdirSync(process.env.HYPERTUBE_DOWNLOAD_PATH+'/'+torrentFilename);
		}
		engine.on('ready', function() {
			engine.files.forEach(function(file) {
				console.log('filename:', file.name);
				var stream = file.createReadStream();
				stream.on('data', (d)=>{
					i++;
					console.log('data:', i, file.name);

					fs.appendFileSync(process.env.HYPERTUBE_DOWNLOAD_PATH+'/'+torrentFilename+'/'+file.name, d);
				});
				// stream is readable stream to containing the file content
			});
		});

		setTimeout(()=>{
			res.writeHead(200);
			res.write(`<html><body><video controls width="400px" autoplay><source src="http://localhost:5555/video/${bs58.encode(Buffer.from(path))}" type="video/mp4"></video></body>
			</html>`);
			res.end();

		}, 10000);
	});

})
.get('/video/:path', (req, res) => {
	streamVideo(req, res, 0).then(r=>{});
});
app.listen(5555);
