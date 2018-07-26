'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const config = require('../../config');
const { api, reply } = require('../../api');
const db = require('../../db');

const router = express.Router();

router.use(cors({ origin: '*' }));
router.use(session({
	store: new SequelizeStore({
		db: db.sequelize
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
	const log_network = debug('codinschool:api:request');
	router.use((req, res, next) => {
		const _end = res.end;
		res.end = (...args) => {
			log_network(`${req.socket.remoteAddress}:${req.socket.remotePort} - ${req.method} ${req.originalUrl} - ${res.statusCode}${res.statusMessage ? ` ${res.statusMessage}` : ''}`);
			_end.apply(res, args);
		};
		next();
	});
}

// Désactivation du cache + Content Security Policy
router.use((req, res, next) => {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	res.header('Content-Security-Policy', `default-src 'self';${config.production ? ' upgrade-insecure-requests;' : ''} referrer no-referrer`);
	next();
});

// router.use('/register', require('./register'));
// router.use('/login', require('./login'));
// router.use('/logout', require('./logout'));

// router.use((req, res, next) => ('user_id' in req.session ? next() : send(res, 401, { message: 'You must be authentificated to use this route' })));

// router.use('/users', require('./users'));

router.use(api({
	"/login": require('./login'),
	"/logout": require('./logout'),
	"/register": require('./register'),
	"/users": require('./users')
}));

router.use((req, res) => reply(res, { _code: 404, _message: 'Route not found' }));
router.use((err, req, res, next) => (!res.headersSent && reply(res, 500, { error: (config.production ? undefined : err.toString()), stack: (config.production ? undefined : err.stack) }), next(err)));

if (!config.production) {
	const debug = require('debug');
	const log_errors = debug('codinschool:api:error');
	router.use((err, req, res, next) => log_errors(`${req.socket.remoteAddress}:${req.socket.remotePort} - ${req.method} ${req.originalUrl} : ${err.stack}`));
}

module.exports = router;

/*

TODO !

module.exports = {
	"/login": require('./login'),
	"/register": require('./register'),
	"/users": require('./users')
};

*/