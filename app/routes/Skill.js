'use strict';

const express = require('express');

const session = require('../session.js');

const router = express.Router();

router.get('/', (req, res) => {
	//if (session.check(req, res))
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