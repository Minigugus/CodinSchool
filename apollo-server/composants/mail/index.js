// //////////////////////////////////////////
// Gestion de l'envoi des mails du serveur //
// //////////////////////////////////////////

import { SMTP, expediteurDefaut } from '../config'
import nodemailer from 'nodemailer'

// Liste des modèles de mail disponibles
const listeModeles = {
  resetMdp: () => import('./modeles/resetMdp')
}
// Récupérer le contenu d'un modèle
const getModele = fn => fn().then(x => x.default)

/**
 * Remplacer les tags %donnée% d'un modèle par leurs vraies données
 *
 * @param {string} modele Modèle de contenu avec valeurs à remplacer entre %
 * @param {Object.<string, string>} remplacement Objet des données à remplacer
 * @return {string} Le modèle avec ses données remplacées
 */
const remplacerDonnees = (modele, remplacement) => {
  // eslint-disable-next-line
  for (const x in remplacement) modele = modele.replace(new RegExp(`%${x}%`, 'g'), remplacement[x])
  return modele
}

/**
 * Envoyer un mail à l'aide de nodemailer
 *
 * @param {{ nom: string, mail: string }} expediteur Données de l'expéditeur
 * @param {{ nom: string, mail: string }} destinataire Données du destinataire
 * @param {string} objet Objet du message
 * @param {string} contenu Contenu du message
 * @return {Promise<object>} Objet précisant le résultat de l'envoi du mail (nodemailer)
 */
const envoyerMail = async ({ expediteur, destinataire, objet, contenu }) => {
  const mailer = nodemailer.createTransport(SMTP)
  return mailer.sendMail({
    from: `"${expediteur.nom}" <${expediteur.mail}>`,
    to: `"${destinataire.nom}" <${destinataire.mail}>`,
    subject: objet,
    html: contenu
  })
}

/**
 * Envoyer un mail en utilisant le modèle `resetMdp.js`
 *
 * @param {{ nom: string, mail: string }} destinataire Données du destinataire
 * @param {Object} r Objet des données à remplacer
 * @param {string} r.nomUtilisateur Nom d'utilisateur du destinataire
 * @param {string} r.lienReset Lien de réinitialisation de mot de passe
 * @return {Promise<object>} Objet précisant le résultat de l'envoi du mail (nodemailer)
 */
export const nouveauMdp = async (destinataire, r) => {
  const modele = await getModele(listeModeles.resetMdp)
  const contenu = remplacerDonnees(modele, r)
  return envoyerMail({
    expediteur: expediteurDefaut,
    destinataire,
    objet: 'Réinitialisation de votre mot de passe',
    contenu
  })
}

export default envoyerMail
