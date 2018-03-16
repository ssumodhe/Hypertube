const fs = require('fs');
const { exec } = require('child_process');
const parseTorrent = require('parse-torrent');
const express = require('express');
const app = express();
const torrentStream = require('torrent-stream');
const bodyParser = require('body-parser');

const Hypertube = new (require('./Hypertube.class.js'))();
const Tools = new (require('./Tools.class.js'))(Hypertube);


try {
	fs.mkdirSync(process.env.HYPERTUBE_DOWNLOAD_PATH);
} catch (e) {
}

app.use(express.static(__dirname+ '/subtitles'));

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
.get('/video/:token', async (req, res) => {
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
// .post('/infos', async (req, res)=>{
// 	try {
// 		const imdbId = await Imdb.getIMDBid(req.body.title);
// 		const infos = await Imdb.getInfos(imdbId);
// 		res.json(infos);
// 	} catch (e) {
// 		res.sendStatus(404);
// 		res.end();
// 	}
// })
app.listen(5555);
console.log('listening on:', process.env.HYPERTUBE_STREAMING_URL);
