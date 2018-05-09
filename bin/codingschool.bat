@echo off

cd %~dp0../

setlocal

set DB_HOST=localhost
set DB_USER=root
set DB_PASS=root
set DB_NAME=codinschool

node app/index.js

endlocal