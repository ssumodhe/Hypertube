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

# GET /subtitles/:suburi
$> curl http://e1r3p13.42.fr:5555/subtitles/Interstellar.2014.720p.BluRay.x264-DAA.vtt
WEBVTT FILE

1
00:01:14.910 --> 00:01:16.995
<i>Well, my dad was a farmer.</i>...

# DELETE /video/:token
$> curl -XDELETE "http://e1r3p13.42.fr:5555/video/44f91a15dfc1c68b3a2d49d452a40dae4b7ae3d7"
OK

# GET /search
# return an array of films, sorted by seeds
$> curl -XPOST http://e1r3p13.42.fr:5555/search/:title
# example:
$> curl -XPOST http://e1r3p13.42.fr:5555/search/interstellar

[ { id: 1632,
    name: 'Interstellar (2014)',
    seeds: 1405,
    leeches: 138,
    category: 'Video',
    link: 'https://yts.am/movie/interstellar-2014',
    magnet_link: 'https://yts.am/torrent/download/89599BF4DC369A3A8ECA26411C5CCF922D78B486' },
  { id: 1632,
    name: 'Interstellar (2014)',
    seeds: 488,
    leeches: 50,
    category: 'Video',
    link: 'https://yts.am/movie/interstellar-2014',
    magnet_link: 'https://yts.am/torrent/download/6E88B3F25BA49D483D740A652BF013C341BC5373' },
  { id: '11756796',
    name: 'Interstellar 2014 Movies 720p BluRay x264 ESubs AAC New ~ ☻rDX☻',
    seeds: 29,
    leeches: 8,
    category: 'Interstellar 2014 Movies 720p BluRay x264 ESubs AAC New ~ ☻rDX☻',
    link: 'https://thepiratebay.org/torrent/11756796/Interstellar_2014_Movies_720p_BluRay_x264_ESubs_AAC_New____rDX_',
    magnet_link: 'magnet:?xt=urn:btih:611bd431861c5dc5be0333b0656af705e4a7dfa7&dn=Interstellar+2014+Movies+720p+BluRay+x264+ESubs+AAC+New+%7E+%E2%98%BBrDX%E2%98%BB&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969' },
...

# GET /infos
# return IMDB film's infos
$> curl -XPOST http://localhost:5555/infos/:title -H
# example:
curl -XPOST http://localhost:5555/infos/Interstellar%202014

{
	"title":"Interstellar",
	"year":"2014",
	"contentRating":"TOUS PUBLICS",
	"runtime":"2h 49min",
	"description":"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
	"rating":"8.6",
	"poster":"https://ia.media-imdb.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg",
	"genre":["Adventure"," Drama"," Sci-Fi"],
	"director":"Christopher Nolan",
	"metascore":"74",
	"writer":"Jonathan Nolan"
}
```
