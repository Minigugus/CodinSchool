'use strict';

const auth = require('../authentification.js');
const bdd = require('../bdd.js');

class Requete {
	moi() {
		return { };
	}

	utilisateur(_, { id }) {
		return bdd.recuperer_utilisateur(id);
	}

	utilisateurs(_, args) {
		return bdd.utilisateurs;
	}

	role(_, { id }) {
		return bdd.recuperer_role(id);
	}

	roles() {
		return bdd.roles;
	}
}
