'use strict';

const express = require('express');

const util = require('../util');

const router = express.Router();

router.get('/', util.check, (req, res) => {
	res.status(200).json([
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