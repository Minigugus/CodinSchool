'use strict';

const bdd = require('../bdd.js');
const auth = require('../acces.js');

const Utilisateur = {
	jeton(_, args, { utilisateur: { id } }) {
		return auth.creerJeton({ id });
	},

	profile(utilisateur, args, { utilisateur: { id } }) {
		return utilisateur;
	},

	permissions(_, args, { utilisateur: { id, permissions } }) {
		return [ ...permissions ];
	}
};

module.exports = Utilisateur;
