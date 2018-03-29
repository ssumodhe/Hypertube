const PirateBay = require('thepiratebay')
const query = require('yify-search');
const yifiSearch = (title) => {
	return new Promise((resolve, reject)=>{
		query.search(title, (error, result) => {
			if (error) reject(error);
			else resolve(result)
		});
	});
}

class Search {
	constructor() {}

	async run(title) {
		try {
			const tpb = await PirateBay.search(title, {
				category: 201,
				orderBy: 'seeds',
				sortBy: 'desc'
			});
			const yifi = await yifiSearch(title);
			let ret = [];
			for (let i in tpb) {
				if (tpb[i].seeders > 0) {
					ret.push({
						id:tpb[i].id,
						name:tpb[i].name,
						seeds:parseInt(tpb[i].seeders),
						leeches:parseInt(tpb[i].leechers),
						category:tpb[i].name,
						link:tpb[i].link,
						magnet_link:tpb[i].magnetLink
					})
				}
			}
			for (let i in yifi) {
				for (let k in yifi[i].torrents) {
					if (yifi[i].torrents[k].seeds > 0) {
						ret.push({
							id:yifi[i].id,
							name:yifi[i].title_long ? yifi[i].title_long : yifi[i].title,
							seeds:parseInt(yifi[i].torrents[k].seeds),
							leeches:parseInt(yifi[i].torrents[k].peers),
							category:'Video',
							link:yifi[i].url,
							magnet_link:yifi[i].torrents[k].url
						})
					}
				}
			}
			return ret.sort((a, b)=>{return b.seeds-a.seeds});
		} catch (e) {
			console.log(e);
			return null;
		}
	}
}

module.exports = Search;

// const search = async (title) => {
// }
//
// search(process.argv[2])
