'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { checkSchema, validationResult } = require('express-validator/check');

const config = require('../../config');
const { send, ok } = require('../../api');
const { User } = require('../../db');

module.exports = express.Router()
.get('/', (req, res, next) => {
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
					req.session.destroy(err => next());
			});
	else
		next();
})
.use(express.json({ limit: '1kb' }))
.use(express.urlencoded({ limit: '1kb', parameterLimit: 2 }))
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
	}
}), (req, res) => {
	const handle = () => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			send(res, 400, { errors: errors.array() });
		else
			User.findOne({ where: { email: req.body.email } })
				.then(user => (user && bcrypt.compare(req.body.password, user.password_hash)
					.then(success => (success ? user : null))))
				.then(user => {
					if (!user)
						send(res, 403, { message: 'Invalid email or password' });
					else
					{
						req.session.user_id = user.id;
						ok(res, {
							lastname: user.lastname,
							firstname: user.firstname,
							email: user.email,
							enabled: user.enabled
						});
					}
				})
				.catch(err => send(res, 500, err));
	};
	res.format({
		'application/json': handle,
		'application/x-www-form-urlencoded': handle,

		'default': () => send(res, 406, { message: 'Format not supported' })
	});
});