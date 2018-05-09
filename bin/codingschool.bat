@echo off

cd %~dp0../

setlocal

set DB_HOST=localhost
set DB_USER=codinschool
set DB_PASS=dev
set DB_NAME=codinschool

node app/index.js

endlocal