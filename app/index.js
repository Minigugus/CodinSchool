'use strict';

const log_info = require('debug')('codinschool:info');
const log_error = require('debug')('codinschool:error');

const path = require("path");
const express = require("express");
const compression = require("compression");

const config = require('./config.js');
const session = require('./session.js');
const routes = require('./routes');

const app = express();

app.set('trust proxy', 1);

app.use(compression());

app.use(config.root, routes);

app.listen(config.port, (err) => {
	if (err)
		log_error(`Server listen failed : ${err}`);
	else
		log_info(`Server listening port ${config.port}. http://localhost:${config.port}${config.root}`);
});