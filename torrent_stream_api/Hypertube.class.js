class Hypertube {
	constructor() {
		this.request = require('request');
	}

	get(token) {
		return new Promise((resolve, reject)=>{
			this.request.get(process.env.HYPERTUBE_VIDEO_API+'/'+token, (err, ret, body) => {
				if (ret.statusCode != 200 || err) reject(err || "error");
				else resolve({body: body, statusCode: 200});
			});
		});
	}

	post(datas) {
		const options = {
			uri: process.env.HYPERTUBE_VIDEO_API,
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			json: {
				"video" : datas
			}
		};
		return new Promise((resolve, reject)=>{
			this.request.post(options, (err, ret, body) => {
				if ((ret.statusCode != 200 && ret.statusCode != 201) || err) {
					this.update(datas)
					.then(r=>{
						resolve(r)
					}).catch(e=>reject(e))
				} else {
					resolve(200);
				}
			});
		});
	}

	update(datas) {
		const options = {
			uri: process.env.HYPERTUBE_VIDEO_API + "/" + datas.token,
			method: 'PUT',
			headers: {
				"Content-Type": "application/json"
			},
			json: {
				"video" : datas
			}
		};
		return new Promise((resolve, reject)=>{
			this.request.put(options, (err, ret, body) => {
				if ((ret.statusCode != 200 && ret.statusCode != 201) || err) reject(err || "error");
				else resolve(200);
			});
		});
	}

	delete(token) {
		return new Promise((resolve, reject)=>{
			this.request.delete(process.env.HYPERTUBE_VIDEO_API+'/'+token, (err, ret, body) => {
				if ((ret.statusCode != 200 && ret.statusCode != 204) || err) reject(err || "error");
				else resolve(200);
			});
		});
	}
}

module.exports = Hypertube;
