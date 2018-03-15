// const fs = require('fs');
const { exec } = require('child_process');
const parseTorrent = require('parse-torrent');
const express = require('express');
const app = express();
const torrentStream = require('torrent-stream');
const bodyParser = require('body-parser');

const Tools = new (require('./Tools.class.js'))();
const Hypertube = new (require('./Hypertube.class.js'))();
const Imdb = new (require('./Imdb.class.js'))();


try {
	fs.mkdirSync(process.env.HYPERTUBE_DOWNLOAD_PATH);
} catch (e) {
}

app.use(express.static(__dirname+ '/subtitles'));

// const getFile = (url, callback) => {
// 	if (url.indexOf("magnet") == 0) {
// 		callback(null, url);
// 	} else {
// 		https.get(url, res => {
// 			const bufs = [];
// 			res.on('data', (chunk) => {
// 				bufs.push(chunk)
// 			});
// 			res.on('end', () => {
// 				const data = Buffer.concat(bufs);
// 				callback(null, data);
// 			});
// 		})
// 		.on('error', callback);
// 	}
// }
//
// const streamVideo = (req, res, ret) => {
// 	const body = JSON.parse(ret.body);
// 	return new Promise((resolve, reject)=>{
// 		try {
// 			console.log('start streaming:', req.params.token);
// 			const path = process.env.HYPERTUBE_DOWNLOAD_PATH + '/' + body.token + '/' + body.path
// 			const fileStream = fs.createReadStream(path);
// 			const converter = ffmpeg()
// 			.input(fileStream)
// 			.outputOptions('-movflags frag_keyframe+empty_moov')
// 			.outputFormat('mp4')
// 			.output(res)
// 			.on('error', (err, stdout, stderr) => {
// 				console.error('ffmpeg error:', err);
// 				resolve(null);
// 			})
// 			converter
// 			.audioCodec('aac')
// 			.videoCodec('libx264')
// 			.run();
// 			res.on('close', () => {
// 				console.log('stream closed');
// 				converter.kill();
// 			});
// 		} catch (e) {
// 			console.error('error streamVideo:', e);
// 			resolve(null);
// 		}
// 	});
// }
//
// const sendHtml = (res, downloadPath, torrentParsed, subtitlesFilename)=>{
// 	console.log(subtitlesFilename);
// 	try {
// 		const retJSON = {
// 			videoUrl: `${process.env.HYPERTUBE_STREAMING_URL}/video/${torrentParsed.infoHash}`,
// 			subtitles: subtitlesFilename
// 		}
// 		console.log(retJSON);
// 		res.json(retJSON);
// 	} catch(e) {
// 		console.error('sendHtml catch:', e);
// 	}
// }
//
// const getSubtitles = (name)=>{
// 	console.log('search subtitles for:', name);
// 	return new Promise((resolve, reject)=>{
// 		OpenSubtitles.search({
// 			sublanguageid: ['eng', 'fre'].join(),       // Can be an array.join, 'all', or be omitted.
// 			extensions: ['srt'], // Accepted extensions, defaults to 'srt'.
// 			limit: 'best',                 // Can be 'best', 'all' or an
// 			// arbitrary nb. Defaults to 'best'
// 			query: name,   // Text-based query, this is not recommended.
// 			// gzip: true                  // returns url to gzipped subtitles, defaults to false
// 		}).then(subtitles => {
// 			console.log(subtitles);
// 			let p = []
// 			for (let k in subtitles) {
// 				p.push(
// 					new Promise((subresolve, subreject)=>{
// 						request.get(subtitles[k].url, (err, ret, body)=>{
// 							if (err) subreject(err);
// 							fs.writeFileSync('subtitles/subtitles'+'/'+subtitles[k].filename, body);
// 							let filename = `${subtitles[k].filename}`.replace(/\.srt$/, ".vtt")
// 							fs.createReadStream('subtitles/subtitles'+'/'+subtitles[k].filename)
// 							.pipe(srt2vtt())
// 							.pipe(fs.createWriteStream('subtitles/subtitles'+'/'+filename))
// 							subresolve({"lang":k, "filename":`subtitles/${filename}`});
// 						})
// 					})
// 				)
// 			}
// 			Promise.all(p)
// 			.then(r=>{resolve(r);})
// 			.catch(e=>{reject(e);})
// 		}).catch(e=>{
// 			console.error('error:', e);
// 		})
// 	});
// }
//
// const generalHandler = async (torrent, torrentParsed, downloadPath, title, res)=>{
// 	const t = torrent;
// 	try {
// 		const subtitles = await getSubtitles(title);
// 		let subtitlesHash = {}
// 		for (let i in subtitles) {
// 			subtitlesHash[subtitles[i].lang] = subtitles[i].filename;
// 		}
// 		Hypertube.post(
// 			title,
// 			torrentParsed.infoHash,
// 			t.name,
// 			subtitlesHash.fr ? subtitlesHash.fr : "",
// 			subtitlesHash.en ? subtitlesHash.en : ""
// 		)
// 		.then(r => {
// 			const size = t.length / (1024 * 1024)
// 			console.log('size:', size);
// 			if (size < 400) {
// 				MIN_SIZE = t.length * 0.1;
// 			} else if (size < 800) {
// 				MIN_SIZE = t.length * 0.05;
// 			} else if (size < 1200) {
// 				MIN_SIZE = t.length * 0.035;
// 			} else {
// 				MIN_SIZE = t.length * 0.02;
// 			}
// 			console.log("min size:", MIN_SIZE);
// 			const interval = setInterval(()=>{
// 				try {
// 					if (fs.existsSync(downloadPath+'/'+t.name)) {
// 						console.log('size:', fs.statSync(downloadPath+'/'+t.name).size);
// 						if (fs.statSync(downloadPath+'/'+t.name).size > MIN_SIZE) {
// 							clearInterval(interval);
// 							sendHtml(res, downloadPath, torrentParsed,
// 								{
// 									'fr': subtitlesHash.fr ? `${process.env.HYPERTUBE_STREAMING_URL}/${subtitlesHash.fr}` : "",
// 									'en': subtitlesHash.en ? `${process.env.HYPERTUBE_STREAMING_URL}/${subtitlesHash.en}` : ""
// 								}
// 							);
// 						}
// 					}
// 				} catch (e) {
// 					console.error('here:', e);
// 				}
// 			}, 1000);
// 		}).catch(e => {
// 			console.error('error Hypertube.post:',e);
// 			res.sendStatus(500);
// 			res.send();
// 		})
// 	} catch (e) {
// 		console.error('error getSubtitles:', e);
// 	}
// }

app.use(bodyParser.json());
app.use((req, res, next)=>{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.post('/url', (req, res)=>{
	let TYPE = 0;
	console.log(req.body.url);
	Tools.getFile(req.body.url, async (err, file) => {
		if (err) { throw new Error(err); }
		if (file.indexOf("magnet") == 0) {
			TYPE = 1;
		}
		const torrentRaw = file;
		try {
			const torrentParsed = parseTorrent(torrentRaw);
			console.log(torrentParsed.infoHash);
			const torrentFilename = torrentParsed.infoHash+'.torrent';
			const torrentPath = 'torrents/'+torrentFilename;
			const downloadPath = process.env.HYPERTUBE_DOWNLOAD_PATH+'/'+torrentParsed.infoHash

			try {
				console.log('getfile done');
				try {
					console.log('mkdir downloadPath');
					fs.mkdirSync(downloadPath);
				} catch (e) {
					console.error('error: mkdir downloadPath');
				}
				try {
					const ret = await Hypertube.get(torrentParsed.infoHash);
					const retBody = JSON.parse(ret.body)
					console.log(retBody);
					if ((ret.statusCode == 200 || ret.statusCode == 201) && ret.body != 'null'/* && fs.existsSync(downloadPath+'/'+torrentParsed.files.sort((a, b)=>{return b.length - a.length})[0].name)*/) {
						console.log('file already downloaded');
						Tools.sendHtml(
							res,
							downloadPath,
							torrentParsed,
							{
								'fr': retBody.subtitles_fr ? `${process.env.HYPERTUBE_STREAMING_URL}/${retBody.subtitles_fr}` : "",
								'en': retBody.subtitles_en ? `${process.env.HYPERTUBE_STREAMING_URL}/${retBody.subtitles_en}` : ""
							}
						);
					} else {
						console.log('unknown file, start downloading');
						const engine = torrentStream(torrentRaw);
						let path = ""
						let i = 0;

						console.log('torrent hash:',torrentParsed.infoHash);
						/* Start torrent-stream engine, create readStream for each files and start downloading */
						engine.on('ready', ()=>{
							engine.files.forEach( async (file) => {
								console.log('filename:', file.name);
								const stream = file.createReadStream();
								stream.on('data', (d)=>{
									i++;
									if (!(i % 100)) console.log('data:', i, file.name);
									fs.appendFileSync(downloadPath+'/'+file.name, d);
								})
								.on('end', ()=>{
									console.log('download done:', file.name);
								})
								.on('error', (e)=>{
									console.error('error downloading:', e);
								});
								/* Trigger only if file size > 200Mo */
								if (TYPE == 1 && file.length > 200 * (1024 * 1024)) {
									Tools.generalHandler(file, torrentParsed, downloadPath, req.body.title, res);
									TYPE = 0;
								}
							});
						});
						/* Add the new file in db, set MIN_SIZE downloaded file that trigger the stream */
						if (TYPE == 0) {
							Tools.generalHandler(
								torrentParsed.files.sort((a, b)=>{return b.length - a.length})[0],
								torrentParsed,
								downloadPath,
								req.body.title,
								res
							);
						}
					}
				} catch (e) {
					console.error('error: check env variables:', e);
					res.sendStatus(500);
					res.send();
				}
			} catch (e) {
				console.error('write file error: chmod 0000 on download path or torrents path?');
				res.sendStatus(500);
			}
		} catch (e) {
			res.sendStatus(404);
			res.end();
		}
	});
})
.get('/video/:token', (req, res) => {
	const exists = (async () => {
		try {
			const ret = await Hypertube.get(req.params.token);
			await Tools.streamVideo(req, res, ret)
		} catch(e) {
			try {
				await Hypertube.delete(req.params.token)

			} catch (e) {

			}
			res.sendStatus(404);
			res.end();
		}
	})();
})
.delete('/video/:token', (req, res)=>{
	if (/^[0-9a-z]{40}$/.test(req.params.token)) {
		const path = process.env.HYPERTUBE_DOWNLOAD_PATH + "/" + req.params.token;
		exec('/bin/rm -rf '+ path, (error, stdout, stderr)=>{
			res.sendStatus(200);
			res.end();
		});
	} else {
		res.sendStatus(200);
		res.end();
	}
})
.post('/infos', async (req, res)=>{
	try {
		const imdbId = await Imdb.getIMDBid(req.body.title);
		const infos = await Imdb.getInfos(imdbId);
		res.json(infos);
	} catch (e) {
		res.sendStatus(404);
		res.end();
	}
})
app.listen(5555);
console.log('listening on:', process.env.HYPERTUBE_STREAMING_URL);
