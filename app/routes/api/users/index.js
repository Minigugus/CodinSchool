'use strict';

const express = require('express');

const { api, APIError } = require('../../../api');
const { User } = require('../../../db');

const LoggedUser = User.scope('self');
const PublicUser = User.scope('public');
const Preference = User.scope('preferences');

// module.exports = express.Router()
// .get('/', api({
// 	perPageMax: 100,
// 	callback: (req, res) =>
// 		PublicUser.findAll().then(users =>
// 			users.map(user =>
// 				(!user.isEmailVisible && !req.session.isAdmin && (user.email = null), user.isEmailVisible = undefined, user)
// 			)
// 		)
// }))
// .get('/:id', api({
// 	validation: {
// 		id: {
// 			in: [ 'params' ],
// 			isInt: true,
// 			toInt: true
// 		}
// 	},
// 	callback: async (req, res) => 
// 		PublicUser.findOne({
// 			where: { id: req.params.id }
// 		}).then(user => (!user.isEmailVisible && !req.session.isAdmin && (user.email = null), user.isEmailVisible = undefined, user))
// }));
// .get('/@me', api(async (req, res) => {
	
// }));
// .patch('/@me', api(async (req, res) => {
	
// }));

const hideEmail = admin => user => (!user.isEmailVisible && !admin && (user.email = null), user.isEmailVisible = undefined, user);

const getUserProfile = (id, admin) =>
	PublicUser.findOne({
		where: { id }
	}).then(hideEmail(admin));

module.exports = {
	GET: {
		per_page: 50,
		per_page_max: 100,
		action: ({ req, ok, fail }) =>
			PublicUser.findAll({ offset: req.locals.offset, limit: req.locals.limit })
			.then(users =>
				users.map(user =>
					(!user.isEmailVisible && !req.session.isAdmin && (user.email = null), user.isEmailVisible = undefined, user)
				)
			)
	},

	"/@me": {
		GET: {
			action: ({ req }) => getUserProfile(req.session.user_id, req.session.admin)
		}
	},
	"/:id": {
		GET: {
			validation: {
				id: {
					in: [ 'params' ],
					isInt: true,
					toInt: true
				}
			},
			action: ({ req }) => getUserProfile(req.params.id, req.session.admin)
		}
	}
};