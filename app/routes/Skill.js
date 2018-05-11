'use strict';

const express = require('express');

const db = require('../db');
const api = require('../api.js');

const USER = express.Router(), ADMIN = express.Router();

USER.get('/', api.check, (req, res) => 
	db.queryAll('SELECT S.ski_id, S.ski_name, SC.ski_level, S.ski_level_max FROM skill_score SC, skill_description S WHERE SC.ski_id = S.ski_id AND SC.acc_id = $1;', [ req.session.account_id ])
		.then(rows => rows.filter(x => x.ski_level_max).map(x => ({ id: x.ski_id, name: x.ski_name, level: Number((x.ski_level / x.ski_level_max).toFixed(2)) }))) // https://stackoverflow.com/questions/9453421
		.then(skills => api.reply(res, 0, skills))
);

module.exports = {
	user: USER,
	admin: ADMIN
};