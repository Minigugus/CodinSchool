'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const config = require('../../config');
const { send, ok, api, APIError } = require('../../api');
const { User } = require('../../db');

module.exports = express.Router()
.get('/', api(async (req, res, next) => {
	if ('user_id' in req.session)
	{
		const user = await User.findOne({ where: { id: req.session.user_id } });
		if (user)
			return {
				lastname: user.lastname,
				firstname: user.firstname,
				email: user.email,
				enabled: user.enabled
			};
		await new Promise(res => req.session.destroy(err => res()));
	}
	throw new APIError(401, 'Not logged on');
}))
.post('/',
	express.json({ limit: '1kb' }),
	express.urlencoded({ limit: '1kb', parameterLimit: 2 }),
	api({
		guest: true,
		validation: {
			email: {
				in: [ 'body' ],
				errorMessage: 'Invalid email',
				isEmail: true
			},
			password: {
				in: [ 'body' ],
				isLength: {
					errorMessage: 'Invalid password',
					options: { min: 3, max: 80 }
				}
			}
		},
		format: [
			'application/json',
			'application/x-www-form-urlencoded'
		],
		callback: async (req, res) => {
			const user = await User.findOne({ where: { email: req.body.email } });
			if (user)
			{
				const passwordValid = await bcrypt.compare(req.body.password, user.password_hash);
				if (passwordValid)
				{
					req.session.user_id = user.id;
					return {
						lastname: user.lastname,
						firstname: user.firstname,
						email: user.email,
						enabled: user.enabled
					};
				}
			}
			throw new APIError(403, 'Invalid Username or Password');
		}
	})
);