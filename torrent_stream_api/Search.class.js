class Search {
	constructor() {}

	run(title, cat = 'Movie', number = 20) {
		return new Promise((resolve, reject) => {
			this.TorrentsSearchApi.search(title, cat, number)
			.then(result => {
				console.log(result);
				resolve();
			})
			.catch(e => reject(e));
		})
	}
}

module.exports = Search;

// const PirateBay = require('thepiratebay')
// const query = require('yify-search');
// const yifiSearch = (title) => {
// 	return new Promise((resolve, reject)=>{
// 		query.search(title, (error, result) => {
// 			if (error) reject(error);
// 			else resolve(result)
// 		});
// 	});
// }
//
// const search = async (title) => {
// 	try {
// 		const tpb = await PirateBay.search(title, {
// 			category: 201,
// 			orderBy: 'seeds',
// 			sortBy: 'desc'
// 		});
// 		const yifi = await yifiSearch(title);
// 		let ret = [];
// 		for (let i in tpb) {
// 			if (tpb[i].seeders > 0) {
// 				ret.push({
// 					id:tpb[i].id,
// 					name:tpb[i].name,
// 					seeds:tpb[i].seeders,
// 					leeches:tpb[i].leechers,
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
// 						seeds:yifi[i].torrents[k].seeds,
// 						leeches:yifi[i].torrents[k].peers,
// 						category:'Video',
// 						link:yifi[i].url,
// 						magnet_link:yifi[i].torrents[k].url
// 					})
// 				}
// 			}
// 		}
// 		console.log('the pirate bay:',ret.sort((a, b)=>{return b.seeds-a.seeds}));
// 		console.log(ret.length);
// 	} catch (e) {
// 		console.log(e);
// 	}
// }
//
// search(process.argv[2])
