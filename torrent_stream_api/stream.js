const fs = require('fs');
const parseTorrent = require('parse-torrent');
const express = require('express');
const app = express();
const ffmpeg = require('fluent-ffmpeg');
const torrentStream = require('torrent-stream');
const https = require('http');
const bs58 = require('bs58');
const Hypertube = new (require('./Hypertube.class.js'))();

/* Subtitles handling */
const request = require('request');
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
	useragent: process.env.HYPERTUBE_OPENSUBTITLES_API_USERAGENT,
	username: process.env.HYPERTUBE_OPENSUBTITLES_API_USERNAME,
	password: process.env.HYPERTUBE_OPENSUBTITLES_API_PASSWORD,
	ssl: true
});
const srt2vtt = require('srt-to-vtt');

app.use(express.static(__dirname+ '/subtitles'));

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
			console.log('token:', req.params.token);
			const path = process.env.HYPERTUBE_DOWNLOAD_PATH + '/' + body.path + '/' + body.title
			console.log('path:', path);
			const fileStream = fs.createReadStream(path);
			const converter = ffmpeg()
			.input(fileStream)
			.outputOptions('-movflags frag_keyframe+empty_moov')
			.outputFormat('mp4')
			// .videoBitrate(512, true)
			.output(res)

			.on('error', (err, stdout, stderr) => {
				console.log('ffmpeg error:', err);
				resolve(null);
			})
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

const sendHtml = (res, downloadPath, torrentParsed, subtitlesFilename)=>{
	const title = (torrentParsed.files.sort((a, b)=>{return b.length - a.length}))[0].name;
	const url = downloadPath+'/'+title;
	try {
		// res.writeHead(200);
		// res.write(`<html><head><meta charset="utf-8"><link href="http://vjs.zencdn.net/6.6.3/video-js.css" rel="stylesheet"></head><body><video controls width="400px" autoplay onerror="console.log('error video');return 0;"><source src="http://${process.env.HYPERTUBE_STREAMING_URL}/video/${torrentParsed.infoHash}" type="video/mp4" onerror="console.log('error source');return 0;"><track kind="subtitles" src="http://${process.env.HYPERTUBE_STREAMING_URL}/subtitles/${subtitlesFilename}" srclang="fr" label="French"></video></body>
		// </html>`);
		const retJSON = {
			videoUrl: `http://${process.env.HYPERTUBE_STREAMING_URL}/video/${torrentParsed.infoHash}`,
			subtitles: subtitlesFilename
		}
		console.log(retJSON);
		res.json(retJSON);
		// res.json({
		// 	videoUrl: `http://${process.env.HYPERTUBE_STREAMING_URL}/video/${torrentParsed.infoHash}`,
		// 	subtitles: subtitlesFilename
		// })
		// res.end();
	} catch(e) {
		console.log('sendHtml catch:', e);
	}
}

const getSubtitles = (name)=>{
	return new Promise((resolve, reject)=>{
		OpenSubtitles.search({
			sublanguageid: ['eng', 'fre'].join(),       // Can be an array.join, 'all', or be omitted.
			extensions: ['srt'], // Accepted extensions, defaults to 'srt'.
			limit: 'best',                 // Can be 'best', 'all' or an
			// arbitrary nb. Defaults to 'best'
			query: name,   // Text-based query, this is not recommended.
			// gzip: true                  // returns url to gzipped subtitles, defaults to false
		}).then(subtitles => {
			// console.log(subtitles);
			let p = []
			for (let k in subtitles) {
				p.push(
					new Promise((subresolve, subreject)=>{
						request.get(subtitles[k].url, (err, ret, body)=>{
							if (err) subreject(err);
							fs.writeFileSync('subtitles/subtitles'+'/'+subtitles[k].filename, body);
							let filename = `${subtitles[k].filename}`.replace(/\.srt$/, ".vtt")
							fs.createReadStream('subtitles/subtitles'+'/'+subtitles[k].filename)
							.pipe(srt2vtt())
							.pipe(fs.createWriteStream('subtitles/subtitles'+'/'+filename))
							subresolve({"lang":k, "filename":filename});
						})
					})
				)
			}
			Promise.all(p)
			.then(r=>{resolve(r);})
			.catch(e=>{reject(e);})

		}).catch(e=>{
			console.log('error:', e);
		})
	});
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
				console.log('mkdir downloadPath');
				fs.mkdirSync(downloadPath);
			} catch (e) {
				console.log('error: mkdir downloadPath');
			}

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

					console.log('torrent hash:',torrentParsed.infoHash);
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
							.on('end', ()=>{
								console.log('download done:', file.name);
							})
							.on('error', (e)=>{
								console.log('error downloading:', e);
							});
						});
					});

					/* Add the new file in db, set MIN_SIZE downloaded file that trigger the stream */
					const t = torrentParsed.files.sort((a, b)=>{return b.length - a.length})[0];
					try {
						const subtitles = await getSubtitles(t.name);
						let subtitlesHash = {}
						for (let i in subtitles) {
							subtitlesHash[subtitles[i].lang] = subtitles[i].filename;
						}
						Hypertube.post(t.name, torrentParsed.infoHash, torrentParsed.infoHash)
						.then(r => {
							const size = t.length / 1048576
							console.log('size:', size);
							if (size < 400) {
								MIN_SIZE = t.length * 0.1;
							} else if (size < 800) {
								MIN_SIZE = t.length * 0.05;
							} else if (size < 1200) {
								MIN_SIZE = t.length * 0.035;
							} else {
								MIN_SIZE = t.length * 0.01;
							}
							console.log("min size:", MIN_SIZE);
							const interval = setInterval(()=>{
								try {
									if (fs.existsSync(downloadPath+'/'+t.name)) {
										console.log('size:', fs.statSync(downloadPath+'/'+t.name).size);
										if (fs.statSync(downloadPath+'/'+t.name).size > MIN_SIZE) {
											clearInterval(interval);
											sendHtml(res, downloadPath, torrentParsed, subtitlesHash);
										}
									}
								} catch (e) {
									console.log('here');
								}
							}, 1000);
						}).catch(e => {
							console.log('error Hypertube.post:',e);
							res.sendStatus(500);
							res.send();
						})
					} catch (e) {
						console.log('error getSubtitles:', e);
					}
				}
			} catch (e) {
				console.log('error: check env variables');
				res.sendStatus(500);
				res.send();
			}
			// })();

			/* Handle if file has been already downloaded ------------------------*/
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
