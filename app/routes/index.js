'use strict';

const express = require('express');

const router = express.Router();

router.use('/api', require('./api'));
router.use('/static', require('./static'));
router.use('/', require('./dist'));

module.exports = router;