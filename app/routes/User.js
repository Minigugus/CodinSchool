'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const db = require('../db');
const config = require('../config.js');
const util = require('../util');
const config = require('../config.js');

const router = express.Router();

const jsonParser = bodyParser.json();
const urlParser = bodyParser.urlencoded({ extended: false });

router.get('/login', util.check, (req, res) => {
	db.queryFirst('SELECT acc_id, acc_name FROM account WHERE acc_id = $1;', [ req.session.account_id ])
		.then(user => (user || Promise.reject(new Error(`Account ID ${req.session.account_id} not found !`))))
		.then(user => res.status(200).json(user))
		.catch(err => {
			console.error(`ERROR Get logged user failed : ${err}`);
			res.status(505).json({ message: 'Internal server error.' });
		});
});

router.post('/login', urlParser, util.validate('username', 'password'), (req, res) => {
	db.queryFirst('SELECT acc_id, acc_password_hash, acc_name FROM account WHERE acc_username = $1;', [ req.body.username ])
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
router.post('/password', util.check, urlParser, util.validate('old_password', 'password'), (req, res) => {
	db.queryFirst('SELECT acc_password_hash FROM account WHERE acc_id = $1;', [ req.session.account_id ])
		.then(user => (user && bcrypt.compare(req.body.old_password, user.password_hash)))
		.then(success => (success ? res.status(403).json({ message: 'Wrong old password.' }) : bcrypt.hash(req.body.password, config.bcrypt_rounds)

			//Whaaaat ? attention !!! tu écrases les hash de tout le monde !! xD oublie pas le where.
			.then(password_hash => db.execute('UPDATE account SET acc_password_hash = $1;', [ req.body.password ]))
			
			.then(rowCount => {
				res.status(204).end();
			})))
		.catch(err => {
			console.error(`ERROR Password change failed : ${err}`);
			res.status(505).json({ message: 'Internal server error.' });
		});
});
router.get('/logout', util.check, (req, res) => {
	req.session.destroy(err => {
		if (err)
			console.error(`ERROR Can't destroy session : ${err}`);
		res.status(204).end();
	});
});

// DEV
router.post('/register', urlParser, util.validate('username', 'password', 'name'), (req, res) => {
	bcrypt.hash(req.body.password, config.bcrypt_rounds)
		.then(password_hash => db.queryFirst('INSERT INTO account (acc_username, acc_password_hash, acc_name) VALUES ($1, $2, $3) RETURNING *;', [ req.body.username, password_hash, req.body.name ]))
		.then(user => res.status(200).json({ id: user.id, name: user.name }))
		.catch(err => {
			console.error(`ERROR Register failed : ${err}`);
			res.status(505).json({ message: 'Internal server error.' });
		});
});

module.exports = router;