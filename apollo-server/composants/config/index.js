// ////////////////////////////////////// //
// Gestion de la configuration du serveur //
// ////////////////////////////////////// //

export const MODE_DEVELOPPEMENT = process.env.NODE_ENV !== 'production'

if (!MODE_DEVELOPPEMENT && !process.env.SECRET_JWT) {
  const requises = [
    'SECRET_JWT',
    'SERVEUR_URL',
    'SMTP_HOTE'
  ].filter(variable => (variable in process.env))
  if (requises.length)
    throw new Error(
      'En mode production, vous devez spécifier les variables suivantes :\n - ' +
      requises.join('\n - ')
    )
}

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
export const SERVIR_FICHIERS_STATIQUES = process.env.SERVIR_FICHIERS_STATIQUES
  ? (process.env.SERVIR_FICHIERS_STATIQUES === 'oui') :
  !MODE_DEVELOPPEMENT

// SERVEUR //
export const SERVEUR_URL = process.env.SERVEUR_URL || `http://localhost:${PORT}`

// SMTP (MAILS) //
// NOTE : Mail désactivés si pas de serveur SMTP spécifié.
export const SMTP_ACTIF = !!process.env.SMTP_HOTE
export const SMTP_HOTE = process.env.SMTP_HOTE
export const SMTP_PORT = process.env.SMTP_PORT
export const SMTP_SECURISE = (process.env.SMTP_SECURE === 'oui')
export const SMTP_UTILISATEUR = process.env.SMTP_USER
export const SMTP_MDP = process.env.SMTP_PASS
export const SMTP_EXPEDITEUR = process.env.SMTP_EXPEDITEUR || '"CodinSchool" <no-reply@codinschool.fr>'
