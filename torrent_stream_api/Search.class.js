const MIN_SEEDS = 100;
const PirateBay = require('thepiratebay');
const query = require('yify-search');
const yifiSearch = (title) => {
	return new Promise((resolve, reject)=>{
		query.search(title, (error, result) => {
			if (error) reject(error);
			else resolve(result)
		});
	});
}

const formatRetSearch = (r) => {
	console.log("format search");
	let ret = []
	for (let i in r.search) {
		if (r.api == "yifi") {
			for (let k in r.search[i].torrents) {
				if (r.search[i].torrents[k].seeds > 0) {
					ret.push({
						id:r.search[i].id,
						name:r.search[i].title_long ? r.search[i].title_long : r.search[i].tittle,
						seeds:parseInt(r.search[i].torrents[k].seeds),
						leeches:parseInt(r.search[i].torrents[k].peers),
						category:'Video',
						link:r.search[i].url,
						magnet_link:r.search[i].torrents[k].url
					})
				}
			}
		} else {
			if (r.search[i].seeders > 0) {
				ret.push({
					id:r.search[i].id,
					name:r.search[i].name,
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

	yifi(title) {
		return new Promise((resolve, reject)=>{
			yifiSearch(title)
			.then(result=>{
				resolve({'api':'yifi', 'search':result});
			}).catch(e=>{reject(e)});
		});
	}

	/* Promise.race between 2 torrent search api, rerun the slower one if the faster didn't return anything */
	async run(title) {
		const THAT = this;
		return new Promise((resolve, reject)=>{
			console.log("run search:", title);
			let p = [
				this.tpb(title),
				this.yifi(title)
			];
			Promise.race(p)
			.then(r=>{
				console.log("race done");
				let ret = formatRetSearch(r);
				if (ret.length > 0) {
					resolve(ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS}));
				} else if (r.api == "tpb") {
					THAT.yifi(title)
					.then(r=>{
						let ret = formatRetSearch(r);
						resolve(ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS}));
					}).catch(e=>{console.log(e);reject(e)})
				} else {
					THAT.tpb(title)
					.then(r=>{
						let ret = formatRetSearch(r);
						resolve(ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS}));
					}).catch(e=>{console.log(e);reject(e)})
				}
			}).catch(e=>{console.log(e);reject(e)});
		});
		// try {
		// 	// const tpb = await PirateBay.search(title, {
		// 	// 	category: 201,
		// 	// 	orderBy: 'seeds',
		// 	// 	sortBy: 'desc'
		// 	// });
		// 	// const yifi = await yifiSearch(title);
		// 	let p = [PirateBay.search(title, {
		// 		category: 201,
		// 		orderBy: 'seeds',
		// 		sortBy: 'desc'
		// 	}), yifiSearch(title)]
		// 	Promise.race(r=>{
		// 		console.log(r);
		// 		let ret = [];
		// 		for (let i in tpb) {
		// 			if (tpb[i].seeders > 0) {
		// 				ret.push({
		// 					id:tpb[i].id,
		// 					name:tpb[i].name,
		// 					seeds:parseInt(tpb[i].seeders),
		// 					leeches:parseInt(tpb[i].leechers),
		// 					category:tpb[i].name,
		// 					link:tpb[i].link,
		// 					magnet_link:tpb[i].magnetLink
		// 				})
		// 			}
		// 		}
		// 		for (let i in yifi) {
		// 			for (let k in yifi[i].torrents) {
		// 				if (yifi[i].torrents[k].seeds > 0) {
		// 					ret.push({
		// 						id:yifi[i].id,
		// 						name:yifi[i].title_long ? yifi[i].title_long : yifi[i].title,
		// 						seeds:parseInt(yifi[i].torrents[k].seeds),
		// 						leeches:parseInt(yifi[i].torrents[k].peers),
		// 						category:'Video',
		// 						link:yifi[i].url,
		// 						magnet_link:yifi[i].torrents[k].url
		// 					})
		// 				}
		// 			}
		// 		}
		// 		return ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS});
		// 	})
		// 	let ret = [];
		// 	for (let i in tpb) {
		// 		if (tpb[i].seeders > 0) {
		// 			ret.push({
		// 				id:tpb[i].id,
		// 				name:tpb[i].name,
		// 				seeds:parseInt(tpb[i].seeders),
		// 				leeches:parseInt(tpb[i].leechers),
		// 				category:tpb[i].name,
		// 				link:tpb[i].link,
		// 				magnet_link:tpb[i].magnetLink
		// 			})
		// 		}
		// 	}
		// 	for (let i in yifi) {
		// 		for (let k in yifi[i].torrents) {
		// 			if (yifi[i].torrents[k].seeds > 0) {
		// 				ret.push({
		// 					id:yifi[i].id,
		// 					name:yifi[i].title_long ? yifi[i].title_long : yifi[i].title,
		// 					seeds:parseInt(yifi[i].torrents[k].seeds),
		// 					leeches:parseInt(yifi[i].torrents[k].peers),
		// 					category:'Video',
		// 					link:yifi[i].url,
		// 					magnet_link:yifi[i].torrents[k].url
		// 				})
		// 			}
		// 		}
		// 	}
		// 	return ret.sort((a, b)=>{return b.seeds-a.seeds}).filter(a=>{return a.seeds > MIN_SEEDS});
		// } catch (e) {
		// 	console.log(e);
		// 	return null;
		// }
	}
}

module.exports = Search;

// const search = async (title) => {
// }
//
// search(process.argv[2])
