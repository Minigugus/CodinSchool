'use strict';

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const config = require('../../config');
const db = require('../../db');

const router = express.Router();

router.use(session({
	store: new SequelizeStore({
		db: db
	}),
	name: config.session_cookie_name,
	secret: config.session_secret,
	saveUninitialized: false,
	resave: false,
	cookie: {
		secure: config.session_cookie_secure
	}
}));

router.use('/register', require('./register'));
router.use('/login', require('./login'));

// router.use('/users', users);

module.exports = router;