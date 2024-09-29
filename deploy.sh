#!/usr/bin/env bash

rm -rf _contagion 2>/dev/null
git clone git@gitswarm.f5net.com:Virtual-Hackathon-2020/contagion.git _contagion
cd _contagion 
if [[ $? -ne 0 ]] ; then
	exit 10
fi
grep -lr 'localhost:5000' frontend/* |while read line ; do sed -i 's/localhost:5000/10.218.10.143:5000/' $line ; done
docker-compose build

docker-compose stop
docker-compose rm -f ###Removes old conf and containers

docker-compose up --no-start
docker-compose start

echo "Logs of docker-compose: "
docker-compose logs