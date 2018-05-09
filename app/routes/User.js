'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const db = require('../db');
const session = require('../session.js');

const router = express.Router();

const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended: false });

router.get('/login', session.check, (req, res) => {
	db.queryFirst('SELECT id, name FROM account WHERE id = $1;', [ req.session.account_id ])
		.then(user => (user || Promise.reject(new Error(`Account ID ${req.session.account_id} not found !`))))
		.then(user => res.status(200).json(user))
		.catch(err => {
			console.error(`ERROR Get logged user failed : ${err}`);
			res.status(505).json({ message: 'Internal server error.' });
		});
});
router.post('/login', urlParser, (req, res) => {
	if (!req.body || !req.body.username || !req.body.password)
		res.status(401).json({ message: 'Invalid request.' });
	else
		db.queryFirst('SELECT id, password_hash, name FROM account WHERE username = $1;', [ req.body.username ])
			.then(user => ({ success: user && bcrypt.compare(req.body.password, user.password_hash), user: user }))
			.then(result => {
				result.success && (req.session.account_id = result.user.id);
				res
					.status(result.success ? 200 : 403)
					.json(result.success ?
						({ id: result.user.id, name: result.user.name }) :
						({ message: 'Invalid username or password.' }));
			})
			.catch(err => {
				console.error(`ERROR Login failed : ${err}`);
				res.status(505).json({ message: 'Internal server error.' });
			});
});
router.post('/password', session.check, urlParser, (req, res) => {
	if (!req.body || !req.body.password)
		res.status(401).json({ message: 'Invalid request.' });
	else
		db.queryFirst('SELECT password_hash FROM account WHERE id = $1;', [ req.session.account_id ])
			.then(user => (user && bcrypt.compare(req.body.old_password, user.password_hash)))
			.then(success => {
				if (!success)
					res.status(403).json({ message: 'Wrong old password.' });
				else
					return bcrypt.hash(req.body.password, config.bcrypt_rounds)
						.then(password_hash => db.execute('UPDATE account SET password_hash = $1;', [ req.body.password ]))
						.then(rowCount => {
							res.status(204).end();
						})
			})
			.catch(err => {
				console.error(`ERROR Password change failed : ${err}`);
				res.status(505).json({ message: 'Internal server error.' });
			});
});
router.get('/logout', (req, res) => {
	if (!session.isValid(req, res))
		res.status(404).json({ message: 'You are not logged in.' });
	else
		req.session.destroy(err => {
			if (err)
				console.error(`ERROR Can't destroy session : ${err}`);
			res.status(204).end();
		});
});

// DEV
router.post('/register', urlParser, (req, res) => {
	if (!req.body || !req.body.username || !req.body.password || !req.body.name)
		res.status(401).json({ message: 'Invalid request.' });
	else
		bcrypt.hash(req.body.password, config.bcrypt_rounds)
			.then(password_hash => db.queryFirst('INSERT INTO account (username, password_hash, name) VALUES ($1, $2, $3) RETURNING *;', [ req.body.username, password_hash, req.body.name ]))
			.then(user => res.status(200).json({ id: user.id, name: user.name }))
			.catch(err => {
				console.error(`ERROR Register failed : ${err}`);
				res.status(505).json({ message: 'Internal server error.' });
			});
});

module.exports = router;