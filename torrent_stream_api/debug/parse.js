const fs = require('fs');
const parseTorrent = require('parse-torrent');

const data = parseTorrent(fs.readFileSync(process.argv[2]));
console.log(data);
