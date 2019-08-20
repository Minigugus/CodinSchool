// import Sequelize from 'sequelize'
import { validerJeton } from './AuthJWT'
import CodinSchoolError, { ErreurInattendueError } from '../erreur'
import { ProfileAvecRoles } from '../utilisateur/ProfileModele'

export * from './AuthJWT'
export * from './AuthMDP'
export { default as DirectiveAcces } from './DirectiveAcces'

export default async jeton => {
  if (!jeton) return null
  // TODO : Ajouter une liste noire pour bloquer les jetons mal utilisés (anti-piratage).
  try {
    const decode = await validerJeton(jeton)
    if (decode && !('id' in decode)) return null
    const utilisateur = await ProfileAvecRoles.findByPk(decode.id)
    return utilisateur ? utilisateur : null
  }
  catch (err) {
    if (err instanceof CodinSchoolError) throw err
    throw new ErreurInattendueError('AUTH_VALIDER_JETON', { jeton, err })
  }
}
