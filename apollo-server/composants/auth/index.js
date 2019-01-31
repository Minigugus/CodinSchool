// import Sequelize from 'sequelize'
import { validerJeton } from './AuthJWT'
import { recupererParID } from '../utilisateur'
import CodinSchoolError, { ErreurInattendueError } from '../erreur'

export * from './AuthJWT'
export * from './AuthMDP'
export { default as DirectiveAcces } from './DirectiveAcces'

export default async jeton => {
  if (!jeton) return null
  // TODO : Ajouter une liste noire pour bloquer les jetons mal utilisés (anti-piratage).
  try {
    if (!/Bearer /.test(jeton)) return null
    jeton = jeton.slice(7)
    const decode = await validerJeton(jeton)
    if (decode && !('id' in decode)) return null
    const utilisateur = await recupererParID(decode.id)
    if (!utilisateur) return null
    return utilisateur
  }
  catch (err) {
    if (err instanceof CodinSchoolError) throw err
    throw new ErreurInattendueError('AUTH_VALIDER_JETON', { jeton, err })
  }
}
