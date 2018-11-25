'use strict';

const bdd = require('../bdd.js');

const Requete = {
	moi(_, args, { utilisateur: { id } }) {
		return bdd.recuperer_utilisateur(id);
	},

	utilisateur(_, { id }) {
		return bdd.recuperer_utilisateur(id);
	},

	utilisateurs(_, args) {
		return bdd.utilisateurs;
	},

	role(_, { id }) {
		return bdd.recuperer_role(id);
	},

	roles() {
		return bdd.roles;
	}
};

module.exports = Requete;
