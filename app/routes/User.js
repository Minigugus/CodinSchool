'use strict';

const express = require('express');

const router = express.Router();

const testJson = {
	id: 42,
	name: "DUPONT Robert"
}

router.post('/login', (req, res) => {
	res.status(200)
		.cookie('codingschool_session', 'fake')
		.cookie('codingschool_user', JSON.stringify(testJson))
		.send();
	//res.status(403).send();
});
router.get('/logout', (req, res) => {
	res.status(200)
		.clearCookie('codingschool_session')
		.clearCookie('codingschool_user')
		.send();
});

module.exports = router;