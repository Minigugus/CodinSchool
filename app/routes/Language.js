'use strict';

const express = require('express');

const api = require('../api.js');

const router = express.Router();

router.get('/', (req, res) => {
	api.reply(res, 0, [
		{
			id: "c",
			name: "C",
		},
		{
			id: "java",
			name: "Java",
		}
	]);
});

module.exports = router;