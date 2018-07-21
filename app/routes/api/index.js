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

if (!config.production) {
	const debug = require('debug');
	const log_network = debug('codinschool:network');
	router.use((req, res, next) => {
		const _end = res.end;
		res.end = (...args) => {
			log_network(`${req.socket.remoteAddress}:${req.socket.remotePort} - ${req.method} ${req.originalUrl} - ${res.statusCode}${res.statusMessage ? ` ${res.statusMessage}` : ''}`);
			_end.apply(res, args);
		};
		next();
	});
}

router.use('/register', require('./register'));
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));

router.use((req, res, next) => ('user_id' in req.session ? next() : send(res, 401, { message: 'You must be authentificated to use this route' })));

// router.use('/users', users);

router.use((req, res) => send(res, 404, { message: 'Route not found' }));
router.use((err, req, res, next) => send(res, 500, { error: (production ? undefined : err) }))

module.exports = router;