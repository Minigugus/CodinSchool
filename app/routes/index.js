'use strict';

const express = require('express');
const cors = require('cors');

const api = require('../api.js');
const session = require('../session.js');

const exercice = require('./Exercice.js');
const language = require('./Language.js');
const skill = require('./Skill.js');
const user = require('./User.js');

const API = express.Router(), USER = express.Router(), ADMIN = express.Router();

API.use(cors());

USER.use(session);
USER.use('/languages', language.user);
USER.use('/', user.user);
USER.use('/skills', skill.user);
USER.use('/exercices', exercice.user);

ADMIN.use('/languages', language.admin);
ADMIN.use('/', user.admin);
ADMIN.use('/skills', skill.admin);
ADMIN.use('/exercices', exercice.admin);

API.use('/', USER);
API.use('/admin', ADMIN);

API.use((req, res, next) => api.reply(res, 2));

module.exports = API;