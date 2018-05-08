'use strict';

const express = require("express");

const config = require('./config.js');
const routes = require('./routes');

const app = express();

app.use((req, res, next) => {
	console.info(`NETWORK ${req.socket.remoteAddress}:${req.socket.remotePort} - ${req.method} ${req.originalUrl}`);
	next();
});

app.use(config.api_url_base, routes);
app.use(express.static('public'));

app.use((req, res, next) => {
	res.status(404).send('Non trouvé !');
});

app.listen(config.port, (err) => {
	if (err)
		console.error(`FATAL Server listen failed : ${err}`);
	else
		console.info(`INFO Server listening port ${config.port}. http://localhost:${config.port}/`);
});