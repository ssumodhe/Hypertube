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

* convert a torrent url in base58,
	exemple: http://www.torrent9.red/get_torrent/l-experience-interdite-flatliners-truefrench-dvdrip-2017.torrent => 54TLbc8y6GnsGjE1ETGrTeMEJqWJYqJcdZcsVnwJpMPLvFjxZDzyuLUP6Nbq6Sj3KjEXSwLHFEJQsqDuofMGnZrDWpYJZMCuWpLfRP3xrsihP4bRKaGCmrtmDtYijFkwPcQcFi1PH

* API
```bash
# GET /url/:base58
$> curl http://localhost:5555/url/54TLbc8y6GnsGjE1ETGrTeMEJqWJYqJcdZcsVnwJpMPLvFjxZDzyuLUP6Nbq6Sj3KjEXSwLHFEJQsqDuofMGnZrDWpYJZMCuWpLfRP3xrsihP4bRKaGCmrtmDtYijFkwPcQcFi1PH
{"videoUrl":"http://localhost:5555/video/ebb4792227a508b99fe6c2431787b9d0593ed234","subtitles":{"en":"Flatliners.2017.720p.BluRay.x264-GECKOS.vtt"}}

# GET /subtitles/:suburi
$> curl http://localhost:5555/subtitles/Flatliners.2017.720p.BluRay.x264-GECKOS.vtt
WEBVTT FILE

1
00:01:38.320 --> 00:01:39.591
Courtney!

2
00:01:53.680 --> 00:01:58.471
<i>I had this sensation of someone
...

```

### TODO:
* Handle non downloading torrents :3
