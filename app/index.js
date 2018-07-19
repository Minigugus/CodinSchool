'use strict';

const express = require('express');

const db = require('./db');
const config = require('./config');

const app = express();

app.set('trust proxy', 1);

app.use(config.root, require('./routes'));

db
.sync()
.then(() => {
	app.listen(config.port, (err) => {
		if (err)
			console.error(`Server listen failed : ${err}`);
		else
			console.info(`Server listening port ${config.port}. http://localhost:${config.port}${config.root}`);
	});
});

module.exports = app;