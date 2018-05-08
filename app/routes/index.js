'use strict';

const express = require('express');

const exercice = require('./Exercice.js');
const language = require('./Language.js');
const skill = require('./Skill.js');
const user = require('./User.js');

const router = express.Router();

router.use('/exercices', exercice);
router.use('/skills', skill);
router.use('/languages', language);
router.use('/', user);

module.exports = router;