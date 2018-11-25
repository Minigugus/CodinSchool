//////////////////////////////////////
// Gestion des restrictions d'accès //
//////////////////////////////////////

'use strict';

const { promisify } = require('util');
const { sign, verify } = require('jsonwebtoken');
const { defaultFieldResolver } = require('graphql');
const { SchemaDirectiveVisitor } = require('graphql-tools');

const bdd = require('./bdd.js');

const { SECRET_JWT, DUREE_VALIDITE_JETON } = require('./config.js');

const jwt = {
	sign: promisify(sign),
	verify: promisify(verify)
};

const TYPE_REQUIS = Symbol();
const DEJA_PROTEGE = Symbol();

const ROLES = [
	'FAIRE_EXERCICE',
	'GERER_EXERCICE',

	'GERER_ROLE',

	'GERER_UTILISATEUR',

	'SAUVEGARDER',
	'RESTAURER'
];

class DirectiveAcces extends SchemaDirectiveVisitor {
	static creerJeton(utilisateur) {
		return jwt.sign(utilisateur, SECRET_JWT, { expiresIn: DUREE_VALIDITE_JETON });
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
				const resoudre = champ.resolve || defaultFieldResolver;
				champ.resolve = async function(...args) {
					if (!champ[TYPE_REQUIS] && !type[TYPE_REQUIS])
						return resoudre.apply(this, args);
					else
					{
						let utilisateur = args[2].utilisateur;
						const permissionsRequises = (champ[TYPE_REQUIS] || []).concat((type[TYPE_REQUIS] || []));
						if (!utilisateur)
						{
							const authentization = args[2].headers["authorization"];
							if (authentization && /^Bearer /.test(authentization))
							{
								try
								{
									utilisateur = await jwt.verify(authentization.slice(7), SECRET_JWT);
									console.error(utilisateur);
									utilisateur.permissions = bdd.recuperer_permissions(utilisateur);
								}
								catch (err)
								{
									console.error(err);
									throw new Error('Jeton de connexion invalide.');
								}
							}
							else
								throw new Error('Cette requête requière une authentification.');
							args[2].utilisateur = utilisateur;
						}
						if (permissionsRequises.every(x => utilisateur.permissions.has(x)))
							return resoudre.apply(this, args);
						throw new Error("Droits d'accès insuffisants.");
					}
				};
			});
		}
	}
}

// module.exports = jwtMiddleware({
// 	secret: SECRET_JWT
// });
module.exports = DirectiveAcces;

module.exports.INVITE = ROLES.INVITE;
module.exports.ETUDIANT = ROLES.ETUDIANT;
module.exports.ADMINISTRATEUR = ROLES.ADMINISTRATEUR;
