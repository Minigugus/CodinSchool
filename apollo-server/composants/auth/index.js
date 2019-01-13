import _DirectiveAcces from './DirectiveAcces'
import { hasher as _hasher, comparer as _comparer } from './motdepasse'
import { validerJeton, creerJeton as _creerJeton } from './jwt'
import CodinSchoolError, { ErreurInattendueError } from '../erreur'
import { activationCompte as mailActivationCompte } from '../mail'
import { Profile, recupererParID, recupererParEmail, recupererParValidation } from '../utilisateur'

import {
  JetonInvalideError,
  IdentifiantsNonReconnusError,
  EmailDejaUtiliseError,
  CodeInvalideError,
  CompteNonActiveError
} from './erreurs'

export const DirectiveAcces = _DirectiveAcces
export const creerJeton = _creerJeton

export const hasher = _hasher
export const comparer = _comparer

// TODO : Répartir les fonctions suivantes dans leur fichiers respectifs.

export const authentifier = async (email, motDePasse) => {
  const utilisateur = await recupererParEmail(email)
  if (
    utilisateur &&
    (await comparer(motDePasse, utilisateur.motDePasse))
  )
    if (!utilisateur.validationInscription)
      return utilisateur
    else
      throw new CompteNonActiveError(utilisateur.id)
  throw new IdentifiantsNonReconnusError(email)
}

export const inscrire = async ({ email, motDePasse, nom, prenom, dateNaissance }) => {
  try {
    const utilisateur = await Profile.create({
      emailPrimaire: email.toLowerCase(),
      motDePasse: await hasher(motDePasse),
      nom,
      prenom,
      dateNaissance
    })
    try {
      await mailActivationCompte(
        utilisateur.emailPrimaire,
        `${utilisateur.prenom} ${utilisateur.nom}`,
        utilisateur.validationInscription
      )
      return utilisateur
    }
    catch (err) {
      // TODO : Supprimer le compte pour libérer l'adresse email.
      throw new ErreurInattendueError('AUTH_INSCRIRE_MAIL_ACTIVATION', { err })
    }
  }
  catch (err) {
    if (err instanceof CodinSchoolError)
      throw err
    else if (
      err.name === 'SequelizeUniqueConstraintError' &&
      err.errors.length === 1 &&
      err.errors[0].type === 'unique violation' &&
      err.errors[0].path === 'emailPrimaire'
    )
      throw new EmailDejaUtiliseError(email)
    throw new ErreurInattendueError('AUTH_INSCRIRE', { err })
  }
}

export const activerCompte = async (code) => {
  const utilisateur = await recupererParValidation(code)
  if (utilisateur) {
    utilisateur.validationInscription = null
    await utilisateur.save()
    return utilisateur.emailPrimaire
  }
  throw new CodeInvalideError(code, utilisateur && utilisateur.validationInscription)
}

export default async jeton => {
  if (!jeton) return null
  // TODO : Ajouter une liste noire pour bloquer les jetons mal utilisés (anti-piratage).
  try {
    if (!/Bearer /.test(jeton)) throw new JetonInvalideError(jeton, 'Méthode `Bearer` requise.')
    jeton = jeton.slice(7)
    const decode = await validerJeton(jeton)
    if (decode && !('id' in decode)) throw new JetonInvalideError(jeton, '`id` non trouvé')
    const utilisateur = await recupererParID(decode.id)
    if (!utilisateur) throw new JetonInvalideError(jeton, `Utilisateur '${decode.id}' non trouvé`)
    return utilisateur
  }
  catch (err) {
    if (err instanceof CodinSchoolError) throw err
    else if (err.name === 'JsonWebTokenError')
      throw new JetonInvalideError(jeton, 'Jeton de connexion invalide.', err)

    throw new ErreurInattendueError('AUTH_VALIDER_JETON', { jeton, err })
  }
}
