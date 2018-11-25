'use strict';

const bdd = require('../bdd.js');

const Role = {
	nb_membre({ membres }) {
		return membres.length;
	},

	membres(role) {
		return bdd.recuperer_utilisateurs_role(role);
	}
};

module.exports = Role;
