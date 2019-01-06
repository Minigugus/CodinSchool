import nodemailer from 'nodemailer'
import { logAttention } from '../log'
import { ErreurInattendueError } from '../erreur'

import {
  SMTP_ACTIF,
  SMTP_HOTE,
  SMTP_PORT,
  SMTP_SECURISE,
  SMTP_UTILISATEUR,
  SMTP_MDP,
  SMTP_EXPEDITEUR
} from '../config'

const SMTP = {
  host: SMTP_HOTE,
  port: SMTP_PORT || 587,
  secure: SMTP_SECURISE,
  auth: SMTP_UTILISATEUR && { user: SMTP_UTILISATEUR, pass: SMTP_MDP }
}

/**
 *  Formater un mail pour l'envoi
 * @param {string|{ nom, mail }} mailOuObjet données à traiter
 * @return {string} String formatée pour l'envoi
 */
export const formaterMail = mailOuObjet =>
  typeof mailOuObjet === 'string' ? mailOuObjet : `"${mailOuObjet.nom}" <${mailOuObjet.mail}>`

/**
 * Envoyer un mail à l'aide de nodemailer
 *
 * @param {string} destinataire Données du destinataire
 * @param {string} objet Objet du message
 * @param {string} contenu Contenu du message
 * @return {Promise<object>} Objet précisant le résultat de l'envoi du mail (nodemailer)
 */
export default (destinataire, objet, contenu) => {
  if (SMTP_ACTIF)
    return nodemailer
      .createTransport(SMTP)
      .sendMail({
        from: SMTP_EXPEDITEUR,
        to: destinataire,
        subject: objet,
        html: contenu
      })
      .catch(err => {
        throw new ErreurInattendueError('ENVOYER_MAIL', { destinataire, objet, err })
      })
  logAttention(`Impossible d'envoyer un mail à '${destinataire}' : le SMTP est désactivé !`)
}
