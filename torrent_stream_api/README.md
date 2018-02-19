### HOW TO RUN ME:
```shell
export HYPERTUBE_DOWNLOAD_PATH="torrent/download/path"
npm install
node stream.js
```

* convert a torrent url in base58,
	exemple: http://www.torrent9.red/get_torrent/one-piece-813-vostfr.torrent => 368La1fSsTuDRmRXWaN3iJKdbZhPFtyVwETwbK8rZgHJZKbeT4Uu12MvJ2AmC3nPf8SkoVGadFvezhpJ9MAwvToR

* go to http://localhost:5555/url/368La1fSsTuDRmRXWaN3iJKdbZhPFtyVwETwbK8rZgHJZKbeT4Uu12MvJ2AmC3nPf8SkoVGadFvezhpJ9MAwvToR
* wait 10 seconds (video is in autoplay mode)

TODO:
	Handle non downloading torrents :3
