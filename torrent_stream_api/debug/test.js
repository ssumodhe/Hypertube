const H = new (require('./Hypertube.class.js'))();

const fget = async (token) => {
	try {
		const r = await H.get(token)
		console.log(r);
	} catch(e) {
		console.log(e);
	}
}

const fpost = async (token, path) => {
	try {
		const r = await H.post(token, path)
		console.log(r);
	} catch(e) {
		console.log(e);
	}
}

const fdelete = async (token) => {
	try {
		const r = await H.delete(token)
		console.log(r);
	} catch(e) {
		console.log(e);
	}
}

switch (process.argv[2]) {
	case "get":
	fget(process.argv[3]);
	break;
	case "post":
	fpost(process.argv[3], process.argv[4], process.argv[5]);
	break;
	case "delete":
	fdelete(process.argv[3]);
	break;
	default:
	break;
}

// try {
// 	const ret = f(process.argv[2]);
// 	console.log(ret);
// } catch(e) {
// 	console.log(e);
// }
