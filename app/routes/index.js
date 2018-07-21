'use strict';

const express = require('express');
const compression = require('compression');

const config = require('../config');

const router = express.Router();

config.production && router.use(compression());

router.use('/api', require('./api'));
router.use('/', require('./public'));

module.exports = router;