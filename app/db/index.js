'use strict';

const info = require('debug')('codinschool:db:info');
const error = require('debug')('codinschool:db:error');

const { Pool } = require('pg');

const config = require('../config');

const pool = new Pool({
	host: config.db_host,
	port: config.db_port,
	database: config.db_name,
	user: config.db_user,
	password: config.db_password
});

function query(text, params) {
	let startDate = Date.now();
	return pool.query(text, params)
		.then(res => {
			info(`${Date.now() - startDate}ms ${text} - ${params ? params.length : 0} parameter(s)`);
			return res;
		})
		.catch(err => {
			error(`${Date.now() - startDate}ms ${text} - ${params ? params.length : 0} parameter(s) - ${err}`);
			throw err;
		});
}

module.exports = {
	pool: () => pool,

	query: query,
	
	execute: (text, params) => query(text, params).then(x => x.rowCount),
	queryFirst: (text, params) => query(text, params).then(x => x.rows[0]),
	queryAll: (text, params) => query(text, params).then(x => x.rows)
};