// ////////////////////////////////////// //
// Gestion de la configuration du serveur //
// ////////////////////////////////////// //

export const MODE_DEVELOPPEMENT = process.env.NODE_ENV !== 'production'

if (!MODE_DEVELOPPEMENT && !process.env.SECRET_JWT)
  throw new Error(
    'En mode production, vous devez spécifier un secret via la variable d\'environnement SECRET_JWT.'
  )

// DÉVELOPPEMENT //
// NOTE : Peut être source de bugs quand activé.
export const ACTIVER_MOCKS = (process.env.ACTIVER_MOCKS === 'oui')

// RÉSEAU //
export const PORT = process.env.PORT || (MODE_DEVELOPPEMENT ? 4000 : 80)

// JETON DE SESSION JWT //
// TODO : Utiliser un clé privée et une clé publique plutôt qu'on secret.
export const SECRET_JWT = process.env.SECRET_JWT || 'modeDeveloppement'
export const DUREE_VALIDITE_JETON = '1d'

// BASE DE DONNÉES //
export const BDD_URI = process.env.BDD_URI || 'postgres://codinschool:codinschool@bdd/codinschool'

// BCRYPT (MOTS DE PASSE) //
export const BCRYPT_ROUND = process.env.BCRYPT_ROUND || 10

// FICHIERS STATIQUES //
export const SERVIR_FICHIERS_STATIQUES =
  !!process.env.SERVIR_FICHIERS_STATIQUES || !MODE_DEVELOPPEMENT

// SMTP pour les envois de mail
export const SMTP = {
  host: process.env.mailSmtpHost,
  port: 587,
  secure: false,
  auth: { user: process.env.mailSmtpLogin, pass: process.env.mailSmtpPass }
}

// Expéditeur par défaut des mails
export const expediteurDefaut = { nom: 'CodinSchool', mail: 'no-reply@codinschool.fr' }
