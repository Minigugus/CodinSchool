'use strict';

const { Pool } = require('pg');

const config = require('../config');

const pool = new Pool({
	host: config.db_host,
	port: config.db_port,
	database: config.db_name,
	user: config.db_user,
	password: config.db_password
});

module.exports = {
	pool: () => pool,

	query: (text, params) => {
		let startDate = Date.now();
		return pool.query(text, params)
			.then(res => {
				console.info(`DB SUCCESS ${Date.now() - startDate}ms ${text} ${params}`);
				return res;
			})
			.catch(err => {
				console.error(`DB FAIL ${Date.now() - startDate}ms ${text} ${params} - ${err}`);
				throw err;
			});
	},
	queryFirst: (text, params) => this.query(text, params).then(x => x.rows[0])
};