### HOW TO RUN ME:
```shell
export HYPERTUBE_DOWNLOAD_PATH="torrent/download/path"
export HYPERTUBE_STREAMING_URL="http://e2r6p18.42.fr:5555"
export HYPERTUBE_VIDEO_API="hypertubeapi/videos"
export HYPERTUBE_OPENSUBTITLES_API_USERAGENT="useragent"
export HYPERTUBE_OPENSUBTITLES_API_USERNAME="username"
export HYPERTUBE_OPENSUBTITLES_API_PASSWORD="password"

npm install
node stream.js
```

* API
```bash
# POST /url
$> curl -XPOST http://e1r3p13.42.fr:5555/url -H "Content-Type: application/json" -d '{"url":"torrent url or magnet", "title":"Film title"}'
# example:
$> curl -XPOST http://e1r3p13.42.fr:5555/url -H "Content-Type: application/json" -d '{"url":"http://www.torrent9.red/get_torrent/interstellar-french-dvdrip-2014.torrent", "title":"Interstellar FRENCH DVDRIP 2014"}'

{
	"videoUrl" : "http://e1r3p13.42.fr:5555/video/2bbfa58659e8d9541e803a4b803d2352b8bc4ecb",
	"subtitles" : {
		"en" : "http://e1r3p13.42.fr:5555/subtitles/Interstellar.2014.720p.BluRay.x264-DAA.vtt",
		"fr" : "http://e1r3p13.42.fr:5555/subtitles/Interstellar.2014.720p.BluRay.x264.DTS-WiKi.fr.vtt"
	}
}

# POST /info
$> curl -XPOST localhost:5555/infos -H "Content-Type: application/json" -d '{"title":"title"}'
# example:
$> curl -XPOST localhost:5555/infos -H "Content-Type: application/json" -d '{"title":"star wars 8 - les derniers jedi"}'
{
	"title":"Star Wars: Episode VIII - Les derniers Jedi","year":"2017",
	"contentRating":"PG-13",
	"runtime":"2h 32min",
	"description":"Rey develops her newly discovered abilities with the guidance of Luke Skywalker, who is unsettled by the strength of her powers. Meanwhile, the Resistance prepares for battle with the First Order.",
	"rating":"7.4",
	"poster":"https://images-na.ssl-images-amazon.com/images/M/MV5BMjQ1MzcxNjg4N15BMl5BanBnXkFtZTgwNzgwMjY4MzI@._V1_UX182_CR0,0,182,268_AL_.jpg",
	"genre":[
		"Action",
		" Adventure",
		" Fantasy"
	],
	"director":"Rian Johnson",
	"metascore":"85",
	"writer":"Rian Johnson"
}

# GET /subtitles/:suburi
$> curl http://e1r3p13.42.fr:5555/subtitles/Interstellar.2014.720p.BluRay.x264-DAA.vtt
WEBVTT FILE

1
00:01:14.910 --> 00:01:16.995
<i>Well, my dad was a farmer.</i>...

# DELETE /video/:token
$> curl -XDELETE "http://e1r3p13.42.fr:5555/video/44f91a15dfc1c68b3a2d49d452a40dae4b7ae3d7"
OK

```
