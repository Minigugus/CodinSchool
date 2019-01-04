// //////////////////////////////////////////
// Gestion de l'envoi des mails du serveur //
// //////////////////////////////////////////

import nodemailer from 'nodemailer'

const configNodemailer = {
  host: process.env.mailSmtpHost,
  port: 587,
  secure: false,
  auth: { user: process.env.mailSmtpLogin, pass: process.env.mailSmtpPass }
}

// Expéditeur par défaut
const expediteurDefaut = { nom: 'CodinSchool', mail: 'no-reply@codinschool.fr' }


// Liste des modèles de mail disponibles
const listeModeles = {
  resetMdp: () => import('./modeles/resetMdp')
}

// Récupérer le contenu d'un modèle
const getModele = fn => fn().then(x => x.default)

// Remplacer les tags %donnée% d'un modèle par leurs vraies données
const remplacerDonnees = (modele, remplacement) => {
  remplacement.forEach(x => {
    modele = modele.replace(new RegExp(`%${x.nom}%`, 'g'), x.donnee)
  })
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
  const mailer = nodemailer.createTransport(configNodemailer)
  return mailer.sendMail({
    from: `"${expediteur.nom}" <${expediteur.mail}>`,
    to: `"${destinataire.nom}" <${destinataire.mail}>`,
    subject: objet,
    html: contenu
  })
}

/**
 * Envoyer un mail en utilisant le modèle
 *
 * @param {{ nom: string, mail: string }} destinataire Données du destinataire
 * @param {Array<{ nom: string, donnee: string }>} remplacement Tableau des données à remplacer
 * @return {Promise<object>} Objet précisant le résultat de l'envoi du mail (nodemailer)
 */
export const nouveauMdp = async (destinataire, remplacement) => {
  const modele = await getModele(listeModeles.resetMdp)
  const contenu = remplacerDonnees(modele, remplacement)
  return envoyerMail({
    expediteur: expediteurDefaut,
    destinataire,
    objet: 'Réinitialisation de votre mot de passe',
    contenu
  })
}

export default envoyerMail
