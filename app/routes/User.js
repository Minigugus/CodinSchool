'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const db = require('../db');
const config = require('../config.js');
const api = require('../api.js');

const router = express.Router();

router.get('/login', api.check, (req, res) => {
	db.queryFirst('SELECT acc_id, acc_name FROM account WHERE acc_id = $1;', [ req.session.account_id ])
		.then(user => (user || Promise.reject(new Error(`Account ID ${req.session.account_id} not found !`))))
		.then(user => api.reply(res, 0, user))
		.catch(err => api.error(res, 'Get logged user failed', err));
});

router.post('/login', api.parsers.url, api.validate('username', 'password'), (req, res) => {
	db.queryFirst('SELECT acc_id, acc_password_hash, acc_name FROM account WHERE acc_username = $1;', [ req.body.username ])
		.then(user => ({ success: user && bcrypt.compare(req.body.password, user.password_hash), user: user }))
		.then(result => {
			if (!result.success)
				api.reply(res, 11);
			else
			{
				req.session.account_id = result.user.id;
				api.reply(res, 0, { id: result.user.acc_id, name: result.user.acc_name });
			}
		})
		.catch(err => api.error(res, 'Login failed', err));
});
router.post('/password', api.check, api.parsers.url, api.validate('old_password', 'password'), (req, res) => {
	db.queryFirst('SELECT acc_password_hash FROM account WHERE acc_id = $1;', [ req.session.account_id ])
		.then(user => (user && bcrypt.compare(req.body.old_password, user.password_hash)))
		.then(success => (success ? api.reply(res, 12) : bcrypt.hash(req.body.password, config.bcrypt_rounds)
			.then(password_hash => db.execute('UPDATE account SET acc_password_hash = $1 WHERE acc_id = $2;', [ req.body.password, req.session.account_id ]))
			.then(rowCount => api.reply(res, 0))))
		.catch(err => api.error(res, 'Password change failed', err));
});
router.get('/logout', api.check, (req, res) => {
	req.session.destroy(err => {
		if (err)
			api.error(res, "Can't destroy session", err);
		else
			api.reply(res, 0);
	});
});

// DEV
router.post('/register', api.parsers.url, api.validate('username', 'password', 'name'), (req, res) => {
	bcrypt.hash(req.body.password, config.bcrypt_rounds)
		.then(password_hash => db.queryFirst('INSERT INTO account (acc_username, acc_password_hash, acc_name) VALUES ($1, $2, $3) RETURNING *;', [ req.body.username, password_hash, req.body.name ]))
		.then(user => api.reply(res, 0, { id: user.id, name: user.name }))
		.catch(err => api.error(res, 'Register failed', err));
});

module.exports = router;