'use strict';

const express = require('express');

const router = express.Router();

router.use(express.static(path.join(__dirname, '../../public/dist')));

module.exports = router;