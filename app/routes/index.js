'use strict';

const log_error_api = require('debug')('codinschool:api:error');
const log_error_static = require('debug')('codinschool:static:error');
const log_network_api = require('debug')('codinschool:network:api');
const log_network_assets = require('debug')('codinschool:network:assets');
const log_network_pages = require('debug')('codinschool:network:pages');

const path = require('path');
const express = require('express');
const cors = require('cors');

const api = require('../api.js');
const config = require('../config.js');
const session = require('../session.js');

const exercice = require('./Exercice.js');
const language = require('./Language.js');
const skill = require('./Skill.js');
const user = require('./User.js');

const loginRegex = /(.*)\/login(\.html)?/;
const unredirected = [
	'/login',
	'/admin/register',
	'/admin/login'
];

const ALL = express.Router(),
	STATIC = express.Router(),
	ASSETS = express.Router(),
	PAGES = express.Router(),
	API = express.Router(),
	USER = express.Router(),
	ADMIN = express.Router();

function log_middleware(type) {
	return (req, res, next) => {
		const oldEnd = res.end;
		res.end = function () {
			type(`${req.socket.remoteAddress}:${req.socket.remotePort} - ${req.method} ${req.originalUrl} - ${res.statusCode}${res.statusMessage ? '' : ` ${res.statusMessage}`}`);
			oldEnd.apply(res, arguments);
		};
		next();
	};
}

// # API

// ## Pour les utilisateurs normaux

USER.use(session);
USER.use('/languages', language.user);
USER.use('/', user.user);
USER.use('/skills', skill.user);
USER.use('/exercices', exercice.user);

// ## Pour l'administrateur

ADMIN.use('/languages', language.admin);
ADMIN.use('/', user.admin);
ADMIN.use('/skills', skill.admin);
ADMIN.use('/exercices', exercice.admin);

if (!config.production) API.use(log_middleware(log_network_api));

API.use(cors({ origin: config.origin }));

API.use('/', USER);
API.use('/admin', ADMIN);

API.use((req, res, next) => api.reply(res, 2));
API.use((err, req, res, next) => api.error(res, 'Unhandler route exception', err));

// # STATIC

if (!config.production) ASSETS.use(log_middleware(log_network_assets));

ASSETS.use(express.static(path.join(__dirname, '../public', 'assets'), { fallthrough: false }));

if (!config.production) PAGES.use(log_middleware(log_network_pages));

PAGES.use(session);
PAGES.get(loginRegex, (req, res, next) => (session.isValid(req) ? res.status(301).redirect(loginRegex.exec(req.originalUrl)[1] + '/') : next()));
PAGES.use((req, res, next) => (session.isValid(req) || unredirected.indexOf(req.originalUrl) !== -1 ? next() : res.status(403).redirect('/login')));
PAGES.use(express.static(path.join(__dirname, '../public'), { extensions: [ 'html' ] }));
PAGES.use((req, res, next) => res.status(404).redirect('/'));

STATIC.use('/assets', ASSETS);
STATIC.use('/', PAGES);

STATIC.use((err, req, res, next) => {
	log_error_static(`Unhandler route exception : ${err}`);
	res.status(505).redirect('/');
});

// # ASSOCIATION

ALL.use('/api', API);
ALL.use('/', STATIC);

module.exports = ALL;