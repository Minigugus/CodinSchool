'use strict';

const express = require('express');

const { api, APIError } = require('../../../api');
const { User } = require('../../../db');

const LoggedUser = User.scope('self');
const PublicUser = User.scope('public');
const Preference = User.scope('preferences');

const hideEmail = admin => user => (!user.isEmailVisible && !admin && (user.email = null), user.isEmailVisible = undefined, user);

const getUserProfile = (id, admin) =>
	PublicUser.findOne({
		where: { id }
	}).then(hideEmail(admin));

module.exports = {
	GET: {
		pagination: {
			default: 50,
			max: 100
		},
		action: ({ req }) =>
			PublicUser.findAll({ offset: req.locals.offset, limit: req.locals.limit })
				.then(users => users.map(hideEmail(req.session.admin)))
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