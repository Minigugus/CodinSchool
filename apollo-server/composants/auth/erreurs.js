import CodinSchoolError from '../erreur'

export class AuthentificationRequiseError extends CodinSchoolError {
  constructor() {
    super('AUTH_REQUISE', 'Cette requête requière une authentification.')
  }
}

export class AccesInterditError extends CodinSchoolError {
  constructor(role, interdits) {
    super('ACCES_REFUSE', 'Droits d\'accès insuffisants.', { role, interdits })
  }
}

export class IdentifiantsNonReconnusError extends CodinSchoolError {
  constructor(email) {
    super('IDENTIFIANTS_INVALIDES', 'Adresse email ou mot de passe incorrect.', { email })
  }
}

export class EmailDejaUtiliseError extends CodinSchoolError {
  constructor(email) {
    super(
      'EMAIL_DEJA_UTILISE',
      `L'adresse ${email} est déjà utilisée. Merci d'en choisir une autre.`,
      { email }
    )
  }
}

export class CodeInvalideError extends CodinSchoolError {
  constructor(code, attendu) {
    super('CODE_ACTIVATION_INVALIDE', 'Code d\'activation incorrect.', { code, attendu })
  }
}

export class CompteNonActiveError extends CodinSchoolError {
  constructor(id) {
    super('COMPTE_NON_ACTIVE', 'Ce compte n\'a pas encore été activé.', { id })
  }
}
