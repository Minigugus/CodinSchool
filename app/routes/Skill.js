'use strict';

const express = require('express');

const db = require('../db');
const api = require('../api.js');

const USER = express.Router(), ADMIN = express.Router();

USER.get('/', api.check, (req, res) => 
	db.queryAll('SELECT S.ski_id, S.ski_name, (SA.ski_level / SA.ski_level_max::float) AS ski_ratio FROM skill S INNER JOIN skill_account SA ON SA.ski_id=S.ski_id WHERE SA.acc_id = $1;', [ req.session.account_id ])
		.then(rows => rows.map(x => ({ id: x.ski_id, name: x.ski_name, level: Number(x.ski_ratio.toFixed(2)) }))) // https://stackoverflow.com/questions/9453421
		.then(skills => api.reply(res, 0, skills))
);

module.exports = {
	user: USER,
	admin: ADMIN
};