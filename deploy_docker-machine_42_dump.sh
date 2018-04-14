#! /bin/bash

# /!\ Please be sure to have docker, docker-machine & virtualbox installed

# We shall use this script to instanciate a docker-machine on 42 school dump
# We are configuring cpu-count, ram, vram & cpucap for a good usage of our
# streaming api as the default parameters seems to be a little light for 
# intended usage

# Create docker-machine with 2 cpu & 4Gb ram
docker-machine -s /goinfre/$USER create --virtualbox-cpu-count "2" --virtualbox-memory "4096" 42

# Stop docker-machine
docker-machine -s /goinfre/$USER stop 42

# Update vram & cpuexecutioncap of docker-machine
VBoxManage modifyvm 42 --vram 128 --cpuexecutioncap 90

# Relaunch docker-machine
docker-machine -s /goinfre/$USER start 42

# Eval docker env params for docker to use docker-machine
eval $(docker-machine -s /goinfre/$USER env 42)

