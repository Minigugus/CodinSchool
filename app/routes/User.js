'use strict';

const express = require('express');

const db = require('../db');
const session = require('../session.js');

const router = express.Router();

router.get('/login', (req, res) => {
	db.queryFirst('SELECT id, password_hash, name FROM account WHERE username = $1;', [ req.body.username ])
		.then(user => ({ success: bcrypt.compare(req.body.password, user.password_hash), user: user }))
		.then(result => {
			result.success && (req.session.account_id = result.user.id);
			res.status(result.success ? 200 : 403).json({ id: result.user.id, name: result.user.name });
		})
		.catch(err => {
			console.error(`ERROR Login failed : ${err}`);
			res.status(505).json({ message: 'Internal server error.' });
		});
});
router.get('/logout', (req, res) => {
	if (!session.isValid(req, res))
		res.status(404).json({ message: 'You are not logged on.' });
	else
		req.session.destroy(err => {
			if (err)
				console.error(`ERROR Can't destroy session : ${err}`);
			res.status(200).json({ });
		});
});

module.exports = router;