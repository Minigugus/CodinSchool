#!/usr/bin/env node

'use strict';

const config = require('./app/config');
const db = require('./app/db');
const app = require('./app');

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