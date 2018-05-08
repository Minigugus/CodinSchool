#!/bin/bash

cd $(dirname $(dirname $(readlink -f $0)))
node app/index.js