'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const config = require('../../config');
const { send, ok, api, APIError } = require('../../api');
const { User, Role } = require('../../db');

const LoggedUser = User.scope('self');
const PublicUser = User.scope('public');
const Preference = User.scope('preferences');

module.exports = {
	level: 'guest',
	GET: async ({ req, ok, fail }) => {
		if ('user_id' in req.session)
		{
			const user = await LoggedUser.findOne({
				where: { id: req.session.user_id }
			});
			if (user) return ok(user);
			await new Promise(res => req.session.destroy(err => res()));
		}
		fail(401, 'Not logged on');
	},
	POST: {
		validation: {
			'email': {
				in: [ 'body' ],
				errorMessage: 'Invalid email',
				isEmail: true
			},
			'password': {
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
		require: [
			express.json({ limit: '1kb' }),
			express.urlencoded({ limit: '1kb', parameterLimit: 2 }),
		],
		action: async ({ req, ok, fail }) => {
			const user = await LoggedUser.findOne({
				where: { email: req.body.email },
				attributes: [ 
					'lastname',
					'firstname',
					'password_hash',
					'email',
					'isAdmin',
					'enabled'
				]
			});
			if (user && (await bcrypt.compare(req.body.password, user.password_hash)))
			{
				req.session.user_id = user.id;
				req.session.admin = user.isAdmin;
				user.password_hash = undefined;
				ok(user);
			}
			else
				fail(403, 'Invalid Username or Password');
			// throw new APIError(403, 'Invalid Username or Password');
		}
	}
};