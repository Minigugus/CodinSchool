// ////////////////////////////////////
// Gestion des restrictions d'accès //
// ////////////////////////////////////

import { defaultFieldResolver } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import { AuthentificationRequiseError, AccesInterditError } from './erreurs'

const TYPE_REQUIS = Symbol()
const DEJA_PROTEGE = Symbol()

export default class DirectiveAcces extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.assurerChampsProteges(type)
    type[TYPE_REQUIS] = this.args.interdit
  }

  visitFieldDefinition(champ, details) {
    this.assurerChampsProteges(details.objectType)
    champ[TYPE_REQUIS] = this.args.interdit
  }

  assurerChampsProteges(type) {
    if (!type[DEJA_PROTEGE]) {
      type[DEJA_PROTEGE] = true
      const champs = type.getFields()
      Object.keys(champs).forEach(nomChamp => {
        const champ = champs[nomChamp]
        const resoudre = champ.resolve || defaultFieldResolver
        const rolesInterdits = (champ[TYPE_REQUIS] || []).concat(type[TYPE_REQUIS] || [])
        champ.resolve = async function (...args) {
          if (champ[TYPE_REQUIS] || type[TYPE_REQUIS]) {
            const utilisateur = args[2].utilisateur
            if (!utilisateur) throw new AuthentificationRequiseError()
            else if (rolesInterdits.includes(utilisateur.role))
              throw new AccesInterditError(utilisateur.role, rolesInterdits)
          }
          return resoudre.apply(this, args)
        }
      })
    }
  }
}
