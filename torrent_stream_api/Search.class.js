const MIN_SEEDS = 50;
const PirateBay = require('thepiratebay');
// const query = require('yify-search');
// const yifiSearch = (title) => {
// 	return new Promise((resolve, reject)=>{
// 		query.search(title, (error, result) => {
// 			if (error) reject(error);
// 			else resolve(result)
// 		});
// 	});
// }
const TorrentSearchApi = require('torrent-search-api');
const torrentSearch = new TorrentSearchApi();
torrentSearch.enableProvider('Rarbg');
// torrentSearch.enableProvider('1337x');

const formatRetSearch = (r) => {
	console.log("format search");
	let ret = []
	for (let i in r.search) {
		if (r.api == "rarbg") {
			if (r.search[i] != undefined && r.search[i].seeds >= MIN_SEEDS) {
				ret.push({
					name:r.search[i].title.split(/\(?[0-9]{4}\)?/)[0].replace(/\./g, ' '),
					seeds:parseInt(r.search[i].seeds),
					leeches:parseInt(r.search[i].peers),
					category:'Video',
					link:r.search[i].url,
					magnet_link:r.search[i].magnet
				})
			}
		} else {
			if (r.search && r.search[i].seeders >= MIN_SEEDS) {
				ret.push({
					id:r.search[i].id,
					name:r.search[i].name.split(/\(?[0-9]{4}\)?/)[0].replace(/\./g, ' '),
					seeds:parseInt(r.search[i].seeders),
					leeches:parseInt(r.search[i].leechers),
					category:r.search[i].name,
					link:r.search[i].link,
					magnet_link:r.search[i].magnetLink
				})
			}
		}
	}
	return ret;
}

class Search {
	constructor() {}

	tpb(title) {
		return new Promise((resolve, reject)=>{
			PirateBay.search(title, {
				category: 201,
				orderBy: 'seeds',
				sortBy: 'desc'
			}).then(result=>{
				resolve({'api':'tpb', 'search':result});
			}).catch(e=>{reject(e)});
		});
	}

	// yifi(title) {
	// 	return new Promise((resolve, reject)=>{
	// 		yifiSearch(title)
	// 		.then(result=>{
	// 			resolve({'api':'yifi', 'search':result});
	// 		}).catch(e=>{reject(e)});
	// 	});
	// }

	rarbg(title) {
		return new Promise((resolve, reject)=>{
			torrentSearch.search(title, 'Movies', 10)
			.then(torrents => {
				resolve({'api': 'rarbg','search':torrents});
			})
			.catch(err => {
				reject(err);
			});
		});
	}

	/* Promise.race between 2 torrent search api, rerun the slower one if the faster didn't return anything */
	async run(title) {
		const THAT = this;
		return new Promise((resolve, reject)=>{
			console.log("run search:", title);
			let p = [
				this.tpb(title),
				this.rarbg(title)
			];
			Promise.race(p)
			.then(r=>{
				console.log("race done");
				let ret = formatRetSearch(r);
				if (ret.length > 0) {
					console.log(ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS}));
					resolve(
						ret.length > 1 ? ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS}) : ret
					);
				} else if (r.api == "tpb") {
					THAT.rarbg(title)
					.then(r=>{
						let ret = formatRetSearch(r);
						resolve(
							ret.length > 1 ? ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS}) : ret
						);
					}).catch(e=>{console.log(e);reject(e)})
				} else {
					THAT.tpb(title)
					.then(r=>{
						let ret = formatRetSearch(r);
						resolve(
							ret.length > 1 ? ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS}) : ret
						);
					}).catch(e=>{console.log(e);reject(e)})
				}
			}).catch(e=>{console.log(e);reject(e)});
		});
	}
}

module.exports = Search;
