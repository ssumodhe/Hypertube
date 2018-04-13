const fs = require('fs');
const { exec } = require('child_process');
const parseTorrent = require('parse-torrent');
const express = require('express');
const app = express();
const torrentStream = require('torrent-stream');
const bodyParser = require('body-parser');

const Hypertube = new (require('./Hypertube.class.js'))();
const Tools = new (require('./Tools.class.js'))(Hypertube);
const Search = new (require('./Search.class.js'))();
const Imdb = new (require('./Imdb.class.js'))();

try {
	fs.mkdirSync(process.env.HYPERTUBE_DOWNLOAD_PATH);
} catch (e) {
}

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static(__dirname+ '/subtitles'));
app.use(bodyParser.json());

// POST start torrent download
app.post('/url', (req, res) => {
	let TYPE = 0;
	console.log(req.body.url);
	Tools.getFile(req.body.url, async (err, file) => {
		if (err) { res.sendStatus(404).end(); return 0; }
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
					console.error('error: mkdir downloadPath:', e);
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
							},
							torrentParsed.infoHash
						);
					} else {
						console.log('unknown file, start downloading');
						const engine = torrentStream(torrentRaw);

						// let path = ""
						let i = 0;

						console.log('torrent hash:',torrentParsed.infoHash);
						/* Start torrent-stream engine, create readStream for each files and start downloading */
						engine.on('ready', ()=>{
							console.log("torrent ready");
							engine.files.forEach( async (file) => {
								console.log("file:", file.name, "size:", file.length);
								/* Trigger only if file size > 200Mo */
								if (/*TYPE == 1 && */file.length > 200 * (1024 * 1024)) {
									try {
										await Tools.generalHandler(file, torrentParsed, downloadPath, req.body.title, res);
										TYPE = 2;
										console.log('filename:', file.name);
										const stream = file.createReadStream();
										stream.on('data', (d)=>{
											i++;
											// if (!(i % 100)) console.log('data:', i, file.name);
											if (!(i % 100)) console.log('data:', i, file.name);
											fs.appendFileSync(downloadPath+'/'+file.name, d);
										})
										.on('end', ()=>{
											console.log('download done:', file.name);
										})
										.on('error', (e)=>{
											console.error('error downloading:', e);
										});
									} catch (e) {
										console.log("error status:", e);
										res.sendStatus(e);
										res.end();
									}
								}
							});
						})
						.on('error', (err)=>{
							console.log(err);
						});
						/* Add the new file in db, set MIN_SIZE downloaded file that trigger the stream */
						if (TYPE == 0) {
							console.log("TYPE 0");
							// Tools.generalHandler(
							// 	torrentParsed.files.sort((a, b)=>{return b.length - a.length})[0],
							// 	torrentParsed,
							// 	downloadPath,
							// 	req.body.title,
							// 	res
							// );
						}
					}
				} catch (e) {
					console.error('error: check env variables:', e);
					res.sendStatus(404);
					res.send();
				}
			} catch (e) {
				console.error('write file error: chmod 0000 on download path or torrents path?');
				res.sendStatus(404);
			}
		} catch (e) {
			res.sendStatus(404);
			res.end();
		}
	});
})

.get('/test',  (req, res) => {
	res.send('<html><video autoplay loop muted="true" controls class="video-js" crossorigin="*"><source src="http://localhost:5555/video/3815d0bdec07c925b6b2247736956b897c1a5de2" type="video/mp4"><track kind="subtitles" src="http://localhost:5556/subtitles/The.Post.2017.720p.BluRay.x264-GECKOS.HI.vtt" lang="en" label="English" default=""></video></html>')
})

// GET video stream
.get('/video/:token', async (req, res) => {
	try {
		const ret = await Hypertube.get(req.params.token);
		await Tools.streamVideo(req, res, ret)
	} catch(e) {
		// try {
		// 	await Hypertube.delete(req.params.token)
		// } catch (e) {
		// }
		res.sendStatus(404);
		res.end();
	}
})

// DELETE video in filesystem
.delete('/video/:token', (req, res) => {
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

// GET search for a torrent given as post data
.get('/search/:title', async (req, res) => {
	try {
		const search = await Search.run(req.params.title);
		// console.log(search);
		// const imdbId = await Imdb.getIMDBid(req.body.title);
		// const infos = await Imdb.getInfos(imdbId);
		res.json(search);
	} catch (e) {
		res.sendStatus(404);
		res.end();
	}
})

// GET search for film's infos given as post data
.get('/infos/:title', async (req, res) => {
	try {
		// const infos = await Search.run(req.body.title);
		// console.log(infos);
		const imdbId = await Imdb.getIMDBid(req.params.title);
		const infos = await Imdb.getInfos(imdbId);
		res.json(infos);
	} catch (e) {
		res.sendStatus(404);
		res.end();
	}
})

// .get('/subtitles/:token', (req, res) => {
// 	if (fs.existsSync('subtitles/subtitles/Interstellar.2014.720p.BluRay.x264.DTS-WiKi.fr.vtt'/* + req.params.token*/)) {
// 		// console.log();
// 		res.header('Content-Type', 'text/plain')
// 		res.send('data:text/plain;base64,'+base64js.fromByteArray(fs.readFileSync('subtitles/subtitles/Interstellar.2014.720p.BluRay.x264.DTS-WiKi.fr.vtt'/* + req.params.token*/)));
// 		res.end();
// 		// const datab64 = base64js(fs.readFileSync())
// 	} else {
// 		res.sendStatus(404);
// 		res.end();
// 	}
// })
app.listen(5555);
console.log('listening on:', process.env.HYPERTUBE_STREAMING_URL);
