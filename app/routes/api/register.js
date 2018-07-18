'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { checkSchema, validationResult } = require('express-validator/check');

const config = require('../../config');
const { send, ok } = require('../../api');
const { User } = require('../../db');

module.exports = express.Router()
.use(express.json({ limit: '2kb' }))
.get('/', (req, res) => {
	if ('user_id' in req.session)
		User.findOne({ where: { id: req.session.user_id } })
			.then(user => {
				if (user)
					ok(res, {
						lastname: user.lastname,
						firstname: user.firstname,
						email: user.email,
						enabled: user.enabled
					});
				else
					send(res, 401, { message: 'Unauthorized' });
			});
	else
		send(res, 401, { message: 'Unauthorized' });
})
.post('/', checkSchema({
	email: {
		in: [ 'body' ],
		errorMessage: 'Invalid email',
		isEmail: true
	},
	password: {
		in: [ 'body' ],
		isLength: {
			errorMessage: 'Invalid password',
			options: { min: 3, max: 30 }
		}
	},
	lastname: {
		in: [ 'body' ],
		isLength: {
			errorMessage: 'Invalid lastname',
			options: { min: 3, max: 30 }
		}
	},
	firstname: {
		in: [ 'body' ],
		isLength: {
			errorMessage: 'Invalid firstname',
			options: { min: 3, max: 30 }
		}
	}
}), (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty())
		send(res, 400, { body: req.body, errors: errors.array() });
	else
		bcrypt.hash(req.body.password, config.bcrypt_rounds)
			.then(password_hash => User.create({
				lastname: req.body.lastname,
				firstname: req.body.firstname,
				email: req.body.email,
				password_hash: password_hash
			}))
			.then(user => ok(res, {
				lastname: user.lastname,
				firstname: user.firstname,
				email: user.email,
				enabled: user.enabled
			}))
			.catch(err => (err.name && err.name === 'SequelizeUniqueConstraintError' ? send(res, 409, { message: 'Email already in use' }) : send(res, 500, err)));
});