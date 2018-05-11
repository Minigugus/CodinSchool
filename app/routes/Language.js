'use strict';

const express = require('express');

const db = require('../db');
const api = require('../api.js');

const USER = express.Router(), ADMIN = express.Router();

USER.get('/', (req, res) => {
	db.queryAll('SELECT lan_id, lan_name FROM language')
		.then(rows => rows.map(x => ({ id: x.lan_id, name: x.lan_name })))
		.then(languages => api.reply(res, 0, languages))
});

ADMIN.get('/', (req, res) => {
	db.queryAll('SELECT * FROM language')
		.then(rows => rows.map(x => ({ id: x.lan_id, name: x.lan_name, source_filename: lan_source_filename, cmd_compile: x.lan_cmd_compile, cmd_exec: x.lan_cmd_exec })))
		.then(languages => api.reply(res, 0, languages))
});

module.exports = {
	user: USER,
	admin: ADMIN
};