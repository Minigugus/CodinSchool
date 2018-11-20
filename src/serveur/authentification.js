//////////////////////////////////////
// Gestion des restrictions d'accès //
//////////////////////////////////////

'use strict';

const { promisify } = require('util');

const { sign, verify } = require('jsonwebtoken');
// const jwtMiddleware = require('express-jwt');
const { SchemaDirectiveVisitor } = require('graphql-tools');

const { SECRET_JWT, DUREE_VALIDITE_JETON } = require('./config.js');

sign = promisify(sign);
verify = promisify(verify);

const TYPE_REQUIS = Symbol();
const DEJA_PROTEGE = Symbol();

const INVITE = 0;
const ETUDIANT = 1;
const ADMINISTRATEUR = 2;

class DirectiveAcces extends SchemaDirectiveVisitor {
	static creerJeton(utilisateur) {
		return sign({
			id: utilisateur.id,
			estAdmin: false
		}, SECRET_JWT, { expiresIn: DUREE_VALIDITE_JETON });
	}

	visitObject(type) {
		this.assurerChampsProteges(type);
		type[TYPE_REQUIS] = this.args.requis;
	}

	visitFieldDefinition(champ, details) {
		this.assurerChampsProteges(details.objectType);
		champ[TYPE_REQUIS] = this.args.requis;
	}

	assurerChampsProteges(type) {
		if (!type[DEJA_PROTEGE])
		{
			type[DEJA_PROTEGE] = true;
			const champs = type.getFields();
			Object.keys(champs).forEach(nomChamp => {
				const champ = champs[nomChamp];
				const resoudre = champ.resolve;
				champ.resolve = async function(...args) {
					const roleRequis = champ[TYPE_REQUIS] || type[TYPE_REQUIS];
					if (!roleRequis || roleRequis === INVITE)
						return resoudre.apply(this, args);
					else
					{
						const utilisateur = await verify(args[2]);
						if (roleRequis === ETUDIANT || (roleRequis === ADMINISTRATEUR && utilisateur.estAdmin))
							return resoudre.apply(this, args);
					}
					throw new
				};
			});
		}
	}
}

// module.exports = jwtMiddleware({
// 	secret: SECRET_JWT
// });
module.exports = DirectiveAcces;

module.exports.INVITE = INVITE;
module.exports.ETUDIANT = ETUDIANT;
module.exports.ADMINISTRATEUR = ADMINISTRATEUR;
