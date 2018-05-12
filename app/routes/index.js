'use strict';

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

API.use(cors({ origin: config.origin }));

API.use('/', USER);
API.use('/admin', ADMIN);

API.use((req, res, next) => api.reply(res, 2));

// # STATIC

ASSETS.use(express.static(path.join(__dirname, '../public', 'assets'), { fallthrough: false }));

PAGES.use(session);
PAGES.use((req, res, next) => (session.isValid(req) || unredirected.indexOf(req.originalUrl) !== -1 ? next() : res.status(403).redirect('/login')));
PAGES.use(express.static(path.join(__dirname, '../public'), { extensions: [ 'html' ] }));
PAGES.use((req, res, next) => res.status(404).redirect('/'));

STATIC.use('/assets', ASSETS);
STATIC.use('/', PAGES);

// # ASSOCIATION

ALL.use(config.api_url_base, API);
ALL.use('/', STATIC);

module.exports = ALL;