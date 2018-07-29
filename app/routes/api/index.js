'use strict';

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const config = require('../../config');
const { api, reply } = require('../../api');
const db = require('../../db');

const router = express.Router();

const morgan = (() => {
	const debug = require('debug');
	try
	{
		const morgan = require('morgan');
		switch (config.log_requests)
		{
			case false:
				return;
			case true:
				return morgan(config.production ? 'combined' : 'dev');
			default:
				return morgan(config.log_requests);
		}
	}
	catch (err)
	{
		return null;
	}
})();

if (morgan) router.use(morgan);

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

// Disable cache + Content Security Policy
router.use((req, res, next) => {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	res.header('Content-Security-Policy', `default-src 'self';${config.production ? ' upgrade-insecure-requests;' : ''} referrer no-referrer`);
	next();
});

router.use(api({
	"/login": require('./login'),
	"/logout": require('./logout'),
	"/register": require('./register'),
	"/users": require('./users')
}));

router.use((req, res) => reply(res, 404, 'Route not found'));
router.use((err, req, res, next) => (!res.headersSent && reply(res, 500, { error: (config.production ? undefined : err.toString()), stack: (config.production ? undefined : err.stack) }), next(err)));

if (!config.production) {
	const debug = require('debug');
	const log_errors = debug('codinschool:api:error');
	router.use((err, req, res, next) => log_errors(`${req.socket.remoteAddress}:${req.socket.remotePort} - ${req.method} ${req.originalUrl} : ${err.stack}`));
}

module.exports = router;