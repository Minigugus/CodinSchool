'use strict';

const bdd = require('../bdd.js');

const Profile = {
	roles(profile) {
		return bdd.recuperer_roles_utilisateur(profile);
	}
};

module.exports = Profile;
