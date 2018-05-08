'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).json([
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