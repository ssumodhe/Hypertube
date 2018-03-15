const IMDB = require('imdb');
const nameToImdb = require("name-to-imdb");

class Imdb {
	constructor(){}

	getIMDBid (title) {
		return new Promise((resolve, reject)=>{
			nameToImdb({name: title}, (err, res, inf)=>{
				if (err) reject(err);
				else resolve(res);
			});
		});
	}

	getInfos (imdbId) {
		return new Promise((resolve, reject)=>{
			IMDB(imdbId, (err, infos)=>{
				if (err) reject(err);
				else resolve(infos);
			});
		});
	}
}

module.exports = Imdb;
