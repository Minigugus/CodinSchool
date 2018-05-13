#!/bin/bash

cd $(dirname $(dirname $(readlink -f $0)))

DEBUG="codinschool:*" \
DB_HOST=localhost \
DB_USER=codinschool \
DB_PASS=dev \
DB_NAME=codinschool \
node app/index.js