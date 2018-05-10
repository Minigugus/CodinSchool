'use strict';

const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const config = require('./config');
const db = require('./db');

const router = express.Router();

router.use(session({
	store: new pgSession({
		pool: db.pool()
	}),
	name: config.session_cookie_name,
	secret: config.session_secret,
	saveUninitialized: false,
	resave: false
}));

module.exports = router;
module.exports.isValid = (req) => !!req.session && !!req.session.account_id;
