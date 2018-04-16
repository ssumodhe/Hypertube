const PirateBay = require('thepiratebay');
const query = require('yify-search');
const yifiSearch = (title) => {
	return new Promise((resolve, reject)=>{
		query[0](title, (error, result) => {
			if (error) reject(error);
			else resolve(result)
		});
	});
}

const Imdb = new (require('./Imdb.class.js'))();
const Hypertube = new (require('./Hypertube.class.js'))();
const parseTorrent = require('parse-torrent');

const MIN_SEEDS = 10;
const formatRetSearch = (r) => {
	console.log("format search");
	let ret = []
	for (let i in r[0]) {
		if (r[0][i].seeders > MIN_SEEDS) {
			ret.push({
				id:r[0][i].id,
				name:r[0][i].name,
				seeds:parseInt(r[0][i].seeders),
				leeches:parseInt(r[0][i].leechers),
				category:r[0][i].name,
				link:r[0][i].link,
				magnet_link:r[0][i].magnetLink
			})
		}
	}
	return ret;
}

const getFile = (url, callback) => {
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


class Search {
	constructor() {}

	tpb(title) {
		return PirateBay.topTorrents(201);
	}

	async run() {
		const THAT = this;
		return new Promise((resolve, reject)=>{
			console.log("run search");
			let p = [
				this.tpb()
				// this.yifi(title)
			];
			Promise.all(p)
			.then(r=>{
				// console.log(r);
				let ret = formatRetSearch(r);
				resolve(ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS}));
			}).catch(e=>{console.log(e);reject(e)});
		});
	}
}

const s = new Search();

s.run("toto")
.then(r=>{
	let ids = []
	for (let i in r) {
		console.log(r[i].name.replace('.', " ").split(/\(?[0-9]{4}/)[0]);
		ids.push(Imdb.getIMDBid(r[i].name.replace('.', " ").split(/\(?[0-9]{4}/)[0]));
	}
	Promise.all(ids)
	.then(async (results) =>{
		console.log(results.length);
		let infos = 0;
		let ret = 0;
		for (let i in results) {
			try {
				infos = await Imdb.getInfos(results[i]);
				const match = r[i].magnet_link.match(/urn:btih:([0-9a-f]{40})/);
				if (match && match[1])
				ret = await Hypertube.post({
					"token": match[1],
					"title":infos.title,
					"content_rating":infos.rating,
					"runtime":infos.runtime,
					"description":infos.description,
					"rating":infos.rating,
					"poster":infos.poster,
					"director":infos.director,
					"metascore":infos.metascore,
					"writer":infos.writer,
					"genre": JSON.stringify(infos.genre ? infos.genre : []),
					"url": r[i].magnet_link,
					"download": 0
				});
				console.log(ret);

			} catch (e) {
				console.log(e);
			}
		}
	}).catch(e=>{
		console.log(e);
	})
}).catch(e=>{
	console.log(e);
})
// PirateBay.topTorrents(201).then(r=>{console.log(r);})
