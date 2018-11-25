'use strict';

const bdd = require('../bdd.js');
const auth = require('../acces.js');

const Mutation = {
	inscription(_, { inscription }, req) {
		const utilisateur = bdd.creer_utilisateur(inscription);
		req.utilisateur = utilisateur;
		return utilisateur;
	},

	connexion(_, { email, mot_de_passe }, req) {
		const utilisateur = bdd.authentifier(email, mot_de_passe);
		req.utilisateur = utilisateur;
		return utilisateur;
	},

	ajouter_roles(_, { id_utilisateur, id_roles }) {
		id_roles.forEach(r => bdd.ajouter_role(id_utilisateur, r));
		return bdd.recuperer_utilisateur(id_utilisateur);
	},

	ajouter_utilisateurs(_, { id_role, id_utilisateurs }) {
		id_utilisateurs.forEach(u => bdd.ajouter_role(u, id_role));
		return bdd.recuperer_role(id_role);
	},

	creer_role(_, { role }) {
		return bdd.creer_role(role);
	},

	editer_role(_, { id, role }) {
		return bdd.editer_role(id, role);
	},

	supprimer_role(_, { id }) {
		return bdd.supprimer_role(id);
	}
};

module.exports = Mutation;
