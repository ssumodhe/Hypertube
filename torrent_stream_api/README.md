### HOW TO RUN ME:
```shell
export HYPERTUBE_DOWNLOAD_PATH="torrent/download/path"
export HYPERTUBE_STREAMING_URL=e2r6p18.42.fr:5555
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
#exemple:
$> curl -XPOST http://e1r3p13.42.fr:5555/url -H "Content-Type: application/json" -d '{"url":"http://www.torrent9.red/get_torrent/interstellar-french-dvdrip-2014.torrent", "title":"Interstellar FRENCH DVDRIP 2014"}'

{
	"videoUrl" : "http://e1r3p13.42.fr:5555/video/2bbfa58659e8d9541e803a4b803d2352b8bc4ecb",
	"subtitles" : {
		"en" : "http://e1r3p13.42.fr:5555/subtitles/Interstellar.2014.720p.BluRay.x264-DAA.vtt",
		"fr" : "http://e1r3p13.42.fr:5555/subtitles/Interstellar.2014.720p.BluRay.x264.DTS-WiKi.fr.vtt"
	}
}

# GET /subtitles/:suburi
$> curl http://e1r3p13.42.fr:5555/subtitles/Interstellar.2014.720p.BluRay.x264-DAA.vtt
WEBVTT FILE

1
00:01:14.910 --> 00:01:16.995
<i>Well, my dad was a farmer.</i>...

```

### TODO:
* Handle non downloading torrents :3
