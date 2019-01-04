import { FAIRE_EXERCICE, GERER_EXERCICE, GERER_UTILISATEUR, SAUVEGARDER, RESTAURER } from './Permissions'
import Role from './Role'

const parDefaut = new Role('Invite', [])
const definition = {
  'Etudiant': [ FAIRE_EXERCICE ],
  'Redacteur': [ FAIRE_EXERCICE, GERER_EXERCICE ],
  'Administrateur': [ FAIRE_EXERCICE, GERER_EXERCICE, GERER_UTILISATEUR, SAUVEGARDER, RESTAURER ]
}

Object.keys(definition).forEach(nom => (definition[nom] = new Role(nom, definition[nom])))

Object.freeze(definition)

export const Roles = Object.keys(definition)

export function recupererRole(nom) {
  return (nom in definition ? definition[nom] : parDefaut)
}
