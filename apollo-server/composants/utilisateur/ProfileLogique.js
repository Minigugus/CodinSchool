import uuidv4 from 'uuid/v4'
import { hasher, comparer } from '../auth'
import CodinSchoolError, { ErreurInattendueError } from '../erreur'
import Profile from './ProfileModele'
import { Role } from '../role'

import { activationCompte as mailActivationCompte, nouveauMdp as mailNouveauMdp } from '../mail'

import {
  IdentifiantsNonReconnusError,
  EmailDejaUtiliseError,
  CodeInvalideError,
  CodeOuEmailInvalideError,
  CompteNonActiveError,
  ValidationEchoueeError,
  UtilisateurNonTrouveError
} from './ProfileErreurs'

export const recupererTous = () => Profile.findAll()
export const recupererParID = id => Profile.findByPk(id)
export const recupererParEmail = email =>
  Profile.findOne({ where: { emailPrimaire: { in: [email.toLowerCase()] } } })
export const recupererParValidation = validation =>
  Profile.findOne({ where: { validationInscription: { in: [validation] } } })

export const creerProfile = async ({ email, motDePasse, nom, prenom, dateNaissance }, validation = false) => {
  try {
    const options = {
      emailPrimaire: email.toLowerCase(),
      motDePasse: await hasher(motDePasse),
      nom,
      prenom,
      dateNaissance
    }
    if (!validation)
      options.validationInscription = null
    const profile = await Profile.create(options)
    try {
      const roles = (await Role.findAll()).filter(role => role.parDefaut).map(role => role.id)
      if (roles.length)
        await profile.setRole(roles)
      return profile
    }
    catch (err) {
      await profile.destroy()
      throw err
    }
  }
  catch (err) {
    if (err instanceof CodinSchoolError) throw err
    else if (
      err.name === 'SequelizeUniqueConstraintError' &&
      err.errors.length === 1 &&
      err.errors[0].type === 'unique violation' &&
      err.errors[0].path === 'emailPrimaire'
    )
      throw new EmailDejaUtiliseError(email)
    else if (err.name === 'SequelizeValidationError')
      throw new ValidationEchoueeError(
        err.errors.map(erreur => ({
          nom: erreur.path,
          validation: erreur.validatorKey,
          valeur: erreur.value,
          message: erreur.message
        }))
      )
    throw new ErreurInattendueError('AUTH_CREER_PROFILE', { err, message: err.message })
  }
}

export const editerProfile = async (id, profile) => {
  if (Object.keys(profile).length) {
    const affecte = await Profile.update(profile, { where: { id } })
    if (!affecte[0])
      throw new UtilisateurNonTrouveError(id)
  }
  return Profile.findByPk(id)
}

export const supprimerProfile = async id => {
  const affecte = await Profile.destroy({ where: { id } })
  if (!affecte)
    throw new UtilisateurNonTrouveError(id)
  return id
}

export const authentifier = async (email, motDePasse) => {
  const utilisateur = await recupererParEmail(email)
  if (utilisateur && (await comparer(motDePasse, utilisateur.motDePasse)))
    if (!utilisateur.validationInscription) return utilisateur
    else throw new CompteNonActiveError(utilisateur.id)
  throw new IdentifiantsNonReconnusError(email)
}

export const inscrire = async (profile) => {
  const utilisateur = await creerProfile(profile, true)
  try {
    await mailActivationCompte(
      utilisateur.emailPrimaire,
      `${utilisateur.prenom} ${utilisateur.nom}`,
      utilisateur.validationInscription
    )
    return utilisateur
  }
  catch (err) {
    // Suppresion du compte pour libérer l'adresse mail
    await utilisateur.destroy()
    throw new ErreurInattendueError('AUTH_INSCRIRE_MAIL_ACTIVATION', { err })
  }
}

export const activerCompte = async code => {
  const utilisateur = await recupererParValidation(code)
  if (utilisateur) {
    utilisateur.validationInscription = null
    await utilisateur.save()
    return utilisateur.emailPrimaire
  }
  throw new CodeInvalideError(code, utilisateur && utilisateur.validationInscription)
}

/**
 * Envoyer une demande de réinitialisation de mot de passe.
 * Pas de retour d'erreur afin de ne pas fuiter d'informations sur les utilisateurs.
 *
 * @param {string} email l'adresse email du compte concerné
 * @return {string} l'adresse email du compte concerné
 */
export const demandeResetMdp = async email => {
  const utilisateur = await recupererParEmail(email)
  if (utilisateur /* && !utilisateur.validationInscription*/) {
    const code = uuidv4() // Sequelize ne permet pas de générer un UUID lors d'une mise à jour
    utilisateur.reinitialisationMdp = code
    await utilisateur.save()
    try {
      await mailNouveauMdp(
        utilisateur.emailPrimaire,
        `${utilisateur.prenom} ${utilisateur.nom}`,
        code
      )
    }
    catch (err) {
      utilisateur.reinitialisationMdp = null
      await utilisateur.save()
    }
  }
  // On ne lève pas d'erreur pour ne pas signaler à l'utilisateur
  // que l'adresse email n'existe pas (anti-robots).
  return email
}

export const resetMdp = async (email, code, mdp) => {
  const utilisateur = await recupererParEmail(email)
  if (utilisateur && utilisateur.reinitialisationMdp === code) {
    utilisateur.motDePasse = await hasher(mdp)
    utilisateur.reinitialisationMdp = null
    await utilisateur.save()
    return utilisateur.emailPrimaire
  }
  throw new CodeOuEmailInvalideError(email, code, utilisateur && utilisateur.reinitialisationMdp)
}
