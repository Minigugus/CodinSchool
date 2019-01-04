// ////////////////////////////////////
// Gestion des restrictions d'accès //
// ////////////////////////////////////

import { promisify } from 'util'
import { sign, verify } from 'jsonwebtoken'
import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import bdd from '../bdd'

import { SECRET_JWT, DUREE_VALIDITE_JETON } from '../composants/config'

const jwt = {
  sign: promisify(sign),
  verify: promisify(verify)
}

const TYPE_REQUIS = Symbol()
const DEJA_PROTEGE = Symbol()

export default class DirectiveAcces extends SchemaDirectiveVisitor {
  static creerJeton(utilisateur) {
    return jwt.sign(utilisateur, SECRET_JWT, { expiresIn: DUREE_VALIDITE_JETON })
  }

  visitObject(type) {
    this.assurerChampsProteges(type)
    type[TYPE_REQUIS] = this.args.requis
  }

  visitFieldDefinition(champ, details) {
    this.assurerChampsProteges(details.objectType)
    champ[TYPE_REQUIS] = this.args.requis
  }

  assurerChampsProteges(type) {
    if (!type[DEJA_PROTEGE]) {
      type[DEJA_PROTEGE] = true
      const champs = type.getFields()
      Object.keys(champs).forEach(nomChamp => {
        const champ = champs[nomChamp]
        const resoudre = champ.resolve || defaultFieldResolver
        champ.resolve = async function (...args) {
          if (!champ[TYPE_REQUIS] && !type[TYPE_REQUIS]) return resoudre.apply(this, args)

          let utilisateur = args[2].utilisateur
          const permissionsRequises = (champ[TYPE_REQUIS] || []).concat(type[TYPE_REQUIS] || [])
          if (!utilisateur) {
            const authentization = args[2].headers.authorization
            if (authentization && /^Bearer /.test(authentization)) {
              try {
                utilisateur = await jwt.verify(authentization.slice(7), SECRET_JWT)
                utilisateur = bdd.recupererUtilisateur(utilisateur.id)
                utilisateur.permissions = bdd.recupererPermissions(utilisateur)
              }
              catch (err) {
                throw new Error('Jeton de connexion invalide.')
              }
            }
            else throw new Error('Cette requête requière une authentification.')
            args[2].utilisateur = utilisateur
          }
          if (permissionsRequises.every(x => utilisateur.permissions.has(x)))
            return resoudre.apply(this, args)
          throw new Error('Droits d\'accès insuffisants.')
        }
      })
    }
  }
}
