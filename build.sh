#!/bin/bash
set -e

task="$1"

#Run unit tests
if [ "$task" == "-t" ]; then
	jasmine
	exit 0
fi

#Create zip file with JS and doc
if [ "$task" == "-d" ]; then

	if [[ -d opentok.js-text-chat ]]
	then
		cd opentok.js-text-chat
		npm i
		npm update
		gulp dist
		cd dist
    gulp zip
		exit 0
	else
		echo "Please run this script from 'JS'."
		exit 1
	fi
fi

echo Invalid parameters, please use ‘-t’ to run tests or ‘-d’ to create zip file with JS and doc.
exit 1
