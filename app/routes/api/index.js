'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const config = require('../../config');
const { send } = require('../../api');
const db = require('../../db');

const router = express.Router();

router.use(cors({ origin: '*' }));
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

router.use((req, res, next) => ('user_id' in req.session ? next() : send(res, 401, { message: 'You must be authentificated to use this route' })));

// router.use('/users', users);

router.use((req, res) => send(res, 404, { message: 'Route not found' }));
router.use((err, req, res, next) => send(res, 500, { error: (production ? undefined : err) }))

module.exports = router;