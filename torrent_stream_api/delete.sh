#!/bin/sh
cd debug && node test.js delete $1 && /bin/rm -rf $HYPERTUBE_DOWNLOAD_PATH/$1
