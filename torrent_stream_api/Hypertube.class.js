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

	post(title, token, path) {
		const options = {
			uri: process.env.HYPERTUBE_VIDEO_API,
			method: 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			json: {
				"video": {
					"title": title,
					"token": token,
					"path": path
				}
			}
		};
		return new Promise((resolve, reject)=>{
			this.request.post(options, (err, ret, body) => {
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
