'use strict';

const express = require("express");

const config = require('./config.js');
const session = require('./session.js');
const routes = require('./routes');

const app = express();

app.set('trust proxy', 1);

app.use((req, res, next) => {
	console.info(`NETWORK ${req.socket.remoteAddress}:${req.socket.remotePort} - ${req.method} ${req.originalUrl}`);
	next();
});

app.use('/', express.static('public'));

app.use(session);
app.use(config.api_url_base, routes);

app.use((req, res, next) => {
	res.status(404).redirect('/');
});

app.listen(config.port, (err) => {
	if (err)
		console.error(`FATAL Server listen failed : ${err}`);
	else
		console.info(`INFO Server listening port ${config.port}. http://localhost:${config.port}/`);
});