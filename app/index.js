'use strict';

const path = require("path");
const express = require("express");

const config = require('./config.js');
const routes = require('./routes');

const app = express();

app.set('trust proxy', 1);

app.use((req, res, next) => {
	console.info(`NETWORK ${req.socket.remoteAddress}:${req.socket.remotePort} - ${req.method} ${req.originalUrl}`);
	// if (req.originalUrl === '/login.html' || req.originalUrl.startsWith('/api/') || session.isValid(req))
		next();
	// else
		// res.redirect(403, '/login.html');
});

app.use(express.static('app/public'));

app.use(config.api_url_base, routes);

app.use((req, res, next) => {
	res.redirect(404, '/');
});

app.listen(config.port, (err) => {
	if (err)
		console.error(`FATAL Server listen failed : ${err}`);
	else
		console.info(`INFO Server listening port ${config.port}. http://localhost:${config.port}/`);
});