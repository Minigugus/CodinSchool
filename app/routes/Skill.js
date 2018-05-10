'use strict';

const express = require('express');

const api = require('../api.js');

const router = express.Router();

router.get('/', api.check, (req, res) => {
	api.reply(res, 0, [
		{
			id: 153,
			name: "Manipulation des chaines de caractères",
			level: 0.5
		},
		{
			id: 406,
			name: "Utilisation de CodinSchool",
			level: 1
		}
	]);
});

module.exports = router;