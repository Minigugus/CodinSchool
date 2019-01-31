// /////////////////////////////////////// //
// Gestion de l'envoi des mails du serveur //
// /////////////////////////////////////// //

import envoyerMail, { formaterMail } from './Mail'
import { SERVEUR_URL } from '../config'

// Modeles
import activationCompteModele from './modeles/activationCompte'
import resetMdpModele from './modeles/resetMdp'

const lienActivation = code => `${SERVEUR_URL}/#/activation/${code}`
const lienReset = (email, code) => `${SERVEUR_URL}/#/resetMdp/${email}/${code}`

/**
 * Envoyer un mail en utilisant le modèle `activationCompte.js`.
 *
 * @param {string} destinataire Adresse email du destinataire
 * @param {string} nom Nom d'utilisateur du destinataire
 * @param {string} code Code d'activation de mot de passe
 * @return {Promise<object>} Objet précisant le résultat de l'envoi du mail (nodemailer)
 */
export const activationCompte = (destinataire, nom, code) =>
  envoyerMail(
    formaterMail({ nom, mail: destinataire }),
    'Activation de votre Compte',
    activationCompteModele(nom, lienActivation(code))
  )

/**
 * Envoyer un mail en utilisant le modèle `resetMdp.js`.
 *
 * @param {string} destinataire Adresse email du destinataire
 * @param {string} nom Nom d'utilisateur du destinataire
 * @param {string} code Code de réinitialisation de mot de passe
 * @return {Promise<object>} Objet précisant le résultat de l'envoi du mail (nodemailer)
 */
export const nouveauMdp = (destinataire, nom, code) =>
  envoyerMail(
    formaterMail({ nom, mail: destinataire }),
    'Réinitialisation de votre mot de passe',
    resetMdpModele(nom, lienReset(destinataire, code))
  )
