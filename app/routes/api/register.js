'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const { checkSchema, validationResult } = require('express-validator/check');

const config = require('../../config');
const { send, ok, api, APIError } = require('../../api');
const { User } = require('../../db');

const LoggedUser = User.scope('self');
const PublicUser = User.scope('public');
const Preference = User.scope('preferences');

// module.exports = express.Router()
// .post('/',
// 	express.json({ limit: '2kb' }), 
// 	express.urlencoded({ limit: '2kb', parameterLimit: 2 }),
// 	api({
// 		guest: true,
// 		success: 201,
// 		validation: {
// 			email: {
// 				in: [ 'body' ],
// 				errorMessage: 'Invalid email',
// 				isEmail: true
// 			},
// 			password: {
// 				in: [ 'body' ],
// 				isLength: {
// 					errorMessage: 'Invalid password',
// 					options: { min: 3, max: 80 }
// 				}
// 			},
// 			lastname: {
// 				in: [ 'body' ],
// 				isLength: {
// 					errorMessage: 'Invalid lastname',
// 					options: { min: 3, max: 30 }
// 				}
// 			},
// 			firstname: {
// 				in: [ 'body' ],
// 				isLength: {
// 					errorMessage: 'Invalid firstname',
// 					options: { min: 3, max: 30 }
// 				}
// 			}
// 		},
// 		callback: async (req, res) => {
// 			const password_hash = await bcrypt.hash(req.body.password, config.bcrypt_rounds);
// 			try
// 			{
// 				const user = await User.create({
// 					lastname: req.body.lastname,
// 					firstname: req.body.firstname,
// 					email: req.body.email,
// 					password_hash: password_hash
// 				});
// 				return {
// 					lastname: user.lastname,
// 					firstname: user.firstname,
// 					email: user.email,
// 					isAdmin: user.isAdmin
// 				};
// 				// return { 'bar': 'foo' };
// 			}
// 			catch (err)
// 			{
// 				if (err.name && err.name === 'SequelizeUniqueConstraintError')
// 					throw new APIError(409, 'Email in use');
// 				throw err;
// 			}
// 		}
// 	})
// );

module.exports = {
	"POST": {
		level: 'guest',
		code: 201,
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
		},
		require: [
			express.json({ limit: '2kb' }), 
			express.urlencoded({ limit: '2kb', parameterLimit: 2 })
		],
		action: async ({ req, ok, fail }) => {
			const password_hash = await bcrypt.hash(req.body.password, config.bcrypt_rounds);
			try
			{
				const user = await User.create({
					lastname: req.body.lastname,
					firstname: req.body.firstname,
					email: req.body.email,
					password_hash: password_hash
				});
				return {
					lastname: user.lastname,
					firstname: user.firstname,
					email: user.email,
					isAdmin: user.isAdmin
				};
			}
			catch (err)
			{
				if (err.name !== 'SequelizeUniqueConstraintError')
					throw err;
				fail(409, 'Email in use', err);
			}
		}
	}
};