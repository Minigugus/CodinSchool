// ////////////////////////////////////
// Gestion des restrictions d'accès //
// ////////////////////////////////////

import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import { AuthentificationRequiseError, AccesInterditError } from './AuthErreurs'

const TYPE_REQUIS = Symbol()
const DEJA_PROTEGE = Symbol()

// TODO : Réécrire cette classe pour la modification des Rôles.
export default class DirectiveAcces extends SchemaDirectiveVisitor {
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
        let permissionsRequises
        champ.resolve = async function (...args) {
          if (champ[TYPE_REQUIS] || type[TYPE_REQUIS]) {
            if (!permissionsRequises)
              permissionsRequises = (champ[TYPE_REQUIS] || []).concat(type[TYPE_REQUIS] || [])
            const utilisateur = args[2].utilisateur
            if (!utilisateur)
              throw new AuthentificationRequiseError()
            const manquantes = permissionsRequises.filter(permission => !utilisateur.permissions.has(permission))
            if (manquantes.length)
              throw new AccesInterditError(manquantes)
          }
          return resoudre.apply(this, args)
        }
      })
    }
  }
}
