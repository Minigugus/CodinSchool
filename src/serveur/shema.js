///////////////////////////////////////////////////////////
// Crée et gère le shéma de l'API GraphQL de CodinSchool //
///////////////////////////////////////////////////////////

'use strict';

const { makeExecutableSchema } = require('graphql-tools');
const { importSchema } = require('graphql-import');

const definitions = importSchema(`${__dirname}/shema.graphql`);

const Requete = require('./shema/Requete.js');
const Mutation = require('./shema/Mutation.js');
const Role = require('./shema/Role.js');
const Profile = require('./shema/Profile.js');
const Utilisateur = require('./shema/Utilisateur.js');

const resolveurs = {
	Requete,
	Mutation,

	Role,
	Profile,
	Utilisateur
};

const DirectiveAcces = require('./acces.js');

module.exports = makeExecutableSchema({
	typeDefs: `
		${definitions}

		schema {
			query: Requete,
			mutation: Mutation
		}
	`,
	resolvers: resolveurs,
	schemaDirectives: { acces: DirectiveAcces }
});
