const H = new (require('./Hypertube.class.js'))()
const r = require('request');

const f = (t) => {
    return new Promise((resolve, reject)=>{
        console.log(t);
        r.delete(process.env.HYPERTUBE_VIDEO_API+'/'+t, (err, ret, body) => {
            console.log('error:', err);
            console.log(ret.statusCode);
            resolve(200);
        })
    })
}

r.get("https://hypertubeapi.tpayet.com/videos", (err, b, r) => {
    const body = JSON.parse(r);
    let p = [];

    for (let i in body)
    {
        p.push(f(body[i].token));
    }
    Promise.all(p)
    .then(results=>{
        console.log(results);
    }).catch(e=>{
        console.log(e);
    })

});
