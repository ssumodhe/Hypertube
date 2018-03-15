const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const http = require('http');
const request = require('request');

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
		if (url.indexOf("magnet") == 0) {
			callback(null, url);
		} else {
			http.get(url, res => {
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
					const fileStream = fs.createReadStream(path);
					const converter = ffmpeg()
					.input(fileStream)
					.outputOptions('-movflags frag_keyframe+empty_moov')
					.outputFormat('mp4')
					.output(res)
					.on('error', (err, stdout, stderr) => {
						console.error('ffmpeg error:', err);
						reject(err);
					})
					converter
					.audioCodec('aac')
					.videoCodec('libx264')
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
				console.error('error streamVideo');
				reject(e);
			}
		});
	}

	sendHtml(res, downloadPath, torrentParsed, subtitlesFilename) {
		console.log(subtitlesFilename);
		try {
			const retJSON = {
				videoUrl: `${process.env.HYPERTUBE_STREAMING_URL}/video/${torrentParsed.infoHash}`,
				subtitles: subtitlesFilename
			}
			console.log(retJSON);
			res.json(retJSON);
		} catch(e) {
			console.error('sendHtml catch:', e);
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
			})
		});
	}

	async generalHandler(torrent, torrentParsed, downloadPath, title, res) {
		const t = torrent;
		try {
			const subtitles = await this.getSubtitles(title);
			let subtitlesHash = {}
			for (let i in subtitles) {
				subtitlesHash[subtitles[i].lang] = subtitles[i].filename;
			}
			const imdbId = await Imdb.getIMDBid(req.body.title);
			const infos = await Imdb.getInfos(imdbId);

			this.Hypertube.post(
				title,
				torrentParsed.infoHash,
				t.name,
				subtitlesHash.fr ? subtitlesHash.fr : "",
				subtitlesHash.en ? subtitlesHash.en : ""
			)
			.then(r => {
				const size = t.length / (1024 * 1024)
				let MIN_SIZE = 0;
				console.log('size:', size);
				if (size < 400) {
					MIN_SIZE = t.length * 0.1;
				} else if (size < 800) {
					MIN_SIZE = t.length * 0.05;
				} else if (size < 1200) {
					MIN_SIZE = t.length * 0.035;
				} else {
					MIN_SIZE = t.length * 0.02;
				}
				console.log("min size:", MIN_SIZE);
				const interval = setInterval(()=>{
					try {
						if (fs.existsSync(downloadPath+'/'+t.name)) {
							console.log('size:', fs.statSync(downloadPath+'/'+t.name).size);
							if (fs.statSync(downloadPath+'/'+t.name).size > MIN_SIZE) {
								clearInterval(interval);
								this.sendHtml(res, downloadPath, torrentParsed,
									{
										'fr': subtitlesHash.fr ? `${process.env.HYPERTUBE_STREAMING_URL}/${subtitlesHash.fr}` : "",
										'en': subtitlesHash.en ? `${process.env.HYPERTUBE_STREAMING_URL}/${subtitlesHash.en}` : ""
									}
								);
							}
						}
					} catch (e) {
						console.error('here:', e);
					}
				}, 1000);
			}).catch(e => {
				console.error('error Hypertube.post:',e);
				res.sendStatus(500);
				res.send();
			})
		} catch (e) {
			console.error('error getSubtitles:', e);
		}
	}
}

module.exports = Tools;
