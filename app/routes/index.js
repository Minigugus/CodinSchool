'use strict';

const express = require('express');

const api = require('../api.js');

const exercice = require('./Exercice.js');
const language = require('./Language.js');
const skill = require('./Skill.js');
const user = require('./User.js');

const router = express.Router();

router.use('/languages', language);
router.use('/', user);
router.use('/skills', skill);
router.use('/exercices', exercice);

router.use((req, res, next) => api.reply(res, 2));

module.exports = router;