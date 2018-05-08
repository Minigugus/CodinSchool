'use strict';

const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
	res.status(200).cookie('codingschool_session', 'fake').send();
	//res.status(403).send();
});
router.get('/logout', (req, res) => {
	res.status(200).clearCookie('codingschool_session').send();
});

module.exports = router;