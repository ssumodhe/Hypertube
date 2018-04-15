const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const http = require('http');
const https = require('https');
const request = require('request');
const Imdb = new (require('./Imdb.class.js'))();

/* Subtitles handling */
const OS = require('opensubtitles-api');
const OpenSubtitles = new OS({
	useragent: process.env.HYPERTUBE_OPENSUBTITLES_API_USERAGENT,
	username: process.env.HYPERTUBE_OPENSUBTITLES_API_USERNAME,
	password: process.env.HYPERTUBE_OPENSUBTITLES_API_PASSWORD,
	ssl: true
});
const srt2vtt = require('srt-to-vtt');

class Tools {
	constructor(Hypertube) {
		this.Hypertube = Hypertube;
	}

	getFile(url, callback) {
		if (url == null || url == undefined) {
			callback("Invalid url");
			return ;
		} else if (url.indexOf("magnet") == 0) {
			callback(null, url);
		} else {
			let protocol = null;
			if (/^http:/.test(url)) {
				protocol = http;
			} else if (/^https:/.test(url)) {
				protocol = https;
			} else {
				callback("Invalid url");
				return ;
			}
			protocol.get(url, res => {
				const bufs = [];
				res.on('data', (chunk) => {
					bufs.push(chunk)
				});
				res.on('end', () => {
					const data = Buffer.concat(bufs);
					callback(null, data);
				});
			})
			.on('error', callback);
		}
	}

	streamVideo(req, res, ret) {
		const body = JSON.parse(ret.body);
		return new Promise((resolve, reject)=>{
			try {
				const path = process.env.HYPERTUBE_DOWNLOAD_PATH + '/' + body.token + '/' + body.path
				if (fs.existsSync(path)) {
					console.log('start streaming:', req.params.token);
					console.log(path);
					const file = fs.statSync(path);

					res.writeHead(200, {
						'Cache-Control': 'no-cache',
						'Content-Type': 'video/mp4'
					})

					const fileStream = fs.createReadStream(path);
					const converter = ffmpeg()
					.input(fileStream)
					.outputFormat('mp4')
					.outputOptions([
						'-movflags empty_moov',
						'-frag_size 8192',
						'-cpu-used 2',
						'-deadline realtime',
						'-error-resilient 1',
						'-threads 4'
					])
					.videoBitrate(640)
					.audioCodec('aac')
					.videoCodec('libx264')
					.output(res)
					.on('error', (err, stdout, stderr) => {
						console.error('ffmpeg error:', err);
						reject(err);
					})

					converter
					.run();

					res.on('close', () => {
						resolve(null);
						console.log('stream closed');
						converter.kill();
					});
				} else {
					console.error("file does not exist");
					reject("file does not exist");
				}
			} catch (e) {
				console.error('error streamVideo:', e);
				reject(e);
			}
		});
	}

	sendHtml(res, downloadPath, torrentParsed, subtitlesFilename, tok) {
		console.log(subtitlesFilename);
		try {
			const retJSON = {
				videoUrl: `${process.env.HYPERTUBE_STREAMING_URL}/video/${torrentParsed.infoHash}`,
				subtitles: subtitlesFilename,
				token: tok
			}
			console.log(retJSON);
			res.json(retJSON);
		} catch(e) {
			console.error('sendHtml catch:', e);
			res.sendStatus(404);
		}
	}

	getSubtitles(name) {
		console.log('search subtitles for:', name);
		return new Promise((resolve, reject)=>{
			OpenSubtitles.search({
				sublanguageid: ['eng', 'fre'].join(),       // Can be an array.join, 'all', or be omitted.
				extensions: ['srt'], // Accepted extensions, defaults to 'srt'.
				limit: 'best',                 // Can be 'best', 'all' or an
				// arbitrary nb. Defaults to 'best'
				query: name,   // Text-based query, this is not recommended.
				// gzip: true                  // returns url to gzipped subtitles, defaults to false
			}).then(subtitles => {
				console.log(subtitles);
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
								subresolve({"lang":k, "filename":`subtitles/${filename}`});
							})
						})
					)
				}
				Promise.all(p)
				.then(r=>{resolve(r);})
				.catch(e=>{reject(e);})
			}).catch(e=>{
				console.error('error:', e);
				reject(e);
			})
		});
	}



	async generalHandler(torrent, torrentParsed, downloadPath, title, res) {
		const THAT = this;
		console.log("start generalHandler");
		return new Promise(async (resolve, reject)=>{
			const t = torrent;
			try {
				const subtitles = await THAT.getSubtitles(title);
				let subtitlesHash = {}
				for (let i in subtitles) {
					subtitlesHash[subtitles[i].lang] = subtitles[i].filename;
				}
				const imdbId = await Imdb.getIMDBid(title);
				console.log("imdbId:", imdbId);
				const infos = await Imdb.getInfos(imdbId);

				console.log("infos:",infos);
				// process.exit(0);
				this.Hypertube.post({
					"title":title,
					"token":torrentParsed.infoHash,
					"path":t.name,
					"subtitles_fr":subtitlesHash.fr ? subtitlesHash.fr : "",
					"subtitles_en":subtitlesHash.en ? subtitlesHash.en : "",
					"content_rating":infos.contentRating,
					"runtime":infos.runtime,
					"description":infos.description,
					"rating":infos.rating,
					"poster":infos.poster,
					"director":infos.director,
					"metascore":infos.metascore,
					"writer":infos.writer,
					"genre": JSON.stringify(infos.genre ? infos.genre : [])
				})
				.then(r => {
					const size = t.length / (1024 * 1024);
					let MIN_SIZE = 0;
					console.log('size:', size);
					if (size < 400) {
						MIN_SIZE = (t.length * 0.1) / (1024 * 1024);
					} else if (size < 800) {
						MIN_SIZE = (t.length * 0.05) / (1024 * 1024);
					} else if (size < 1200) {
						MIN_SIZE = (t.length * 0.025) / (1024 * 1024);
					} else {
						MIN_SIZE = (t.length * 0.015) / (1024 * 1024);
					}
					console.log("min size:", MIN_SIZE);
					const interval = setInterval(()=>{
						try {
							if (fs.existsSync(downloadPath+'/'+t.name)) {
								console.log('size:', fs.statSync(downloadPath+'/'+t.name).size / (1024 * 1024));
								if (fs.statSync(downloadPath+'/'+t.name).size / (1024 * 1024) > MIN_SIZE) {
									clearInterval(interval);
									this.sendHtml(res, downloadPath, torrentParsed,
										{
											'fr': subtitlesHash.fr ? `${process.env.HYPERTUBE_STREAMING_URL}/${subtitlesHash.fr}` : "",
											'en': subtitlesHash.en ? `${process.env.HYPERTUBE_STREAMING_URL}/${subtitlesHash.en}` : ""
										},
										torrentParsed.infoHash
									);
								}
							}
							resolve(null)
						} catch (e) {
							console.error('here:', e);
							reject(404);
						}
					}, 1000);
				}).catch(e => {
					console.error('error Hypertube.post:',e);
					// res.sendStatus(404);
					// res.send();
					reject(404);
				})
			} catch (e) {
				console.error('error getSubtitles:', e);
				// res.sendStatus(417); /* Unexpectetion failed */
				// res.send();
				reject(417);
			}
		});
	}
}

module.exports = Tools;
