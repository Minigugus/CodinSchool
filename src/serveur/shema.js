///////////////////////////////////////////////////////////
// Crée et gère le shéma de l'API GraphQL de CodinSchool //
///////////////////////////////////////////////////////////

'use strict';

const { join } = require('path');
const { readFileSync } = require('fs');
const { makeExecutableSchema } = require('graphql-tools');

const DirectiveAcces = require('./authentification.js');

// const resolveurs = {
// 	// A FAIRE
// 	Requete: {
// 		moi: (_, args, { utilisateur }) => utilisateur,

// 		utilisateur: (_, { id }) => bdd.recuperer_utilisateur(id),
// 		utilisateurs: () => bdd.utilisateurs, //console.error(Array.from(arguments));

// 		role: (_, { id }) => bdd.recuperer_role(id),
// 		roles: () => bdd.roles //console.error(Array.from(arguments));
// 	},
// 	Mutation: {
// 		inscription: (_, { inscription }) => {
// 			const utilisateur = bdd.creer_utilisateur(inscription);
// 			console.error(utilisateur);
// 			return ({ id_connecte: utilisateur.id, jeton: auth.creerJeton(utilisateur.id) });
// 		},
// 		connexion: (_, { email, mot_de_passe }) => {
// 			const utilisateur = bdd.authentifier(email, mot_de_passe);
// 			console.error(utilisateur);
// 			return ({ id_connecte: utilisateur.id, jeton: auth.creerJeton(utilisateur.id) });
// 		},

// 		ajouter_roles: (_, { id_utilisateur, id_roles }) => {
// 			id_roles.forEach(r => bdd.ajouter_role(id_utilisateur, r));
// 			return bdd.recuperer_utilisateur(id_utilisateur);
// 		},
// 		ajouter_utilisateurs: (id_role, id_utilisateurs) => {
// 			id_utilisateurs.forEach(u => bdd.ajouter_role(u, id_role));
// 			return bdd.recuperer_utilisateur(id_utilisateur);
// 		},

// 		creer_role: (_, { role }) => bdd.creer_role(role),
// 		editer_role: (_, { id, role }) => bdd.editer_role(id, role),
// 		supprimer_role: (_, { id }) => bdd.supprimer_role(id)
// 	},
// 	Profile: {
// 		roles: profile => bdd.recuperer_roles_utilisateur(profile)
// 	},
// 	Role: {
// 		nb_membre: role => role.membres.length,
// 		membres: role => bdd.recuperer_utilisateurs_role(role)
// 	},
// 	Utilisateur: {
// 		jeton: ({ id }) => auth.,
// 		profile: ({ id }) => bdd.recuperer_utilisateur(id),
// 		permissions: (_, args, {  })
// 	}
// };

module.exports = makeExecutableSchema({
	// On charge le shéma depuis le fichier pour ne pas surcharger ce fichier.
	typeDefs: readFileSync(join(__dirname, 'shema.graphql'), 'utf8'),
	resolvers: {
		Requete : require('./shema/Requete.js'),
		// Mutation : require('./shema/Mutation.js')
	},
	schemaDirectives: {
		acces: DirectiveAcces
	}
});
