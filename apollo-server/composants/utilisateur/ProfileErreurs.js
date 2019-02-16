import CodinSchoolError from '../erreur'

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

export class CodeOuEmailInvalideError extends CodinSchoolError {
  constructor(email, code, attendu) {
    super('CODE_EMAIL_INVALIDE', 'Code de réinitialisation ou email incorrect.', {
      email,
      code,
      attendu
    })
  }
}

export class CompteNonActiveError extends CodinSchoolError {
  constructor(id) {
    super('COMPTE_NON_ACTIVE', 'Ce compte n\'a pas encore été activé.', { id })
  }
}

export class ValidationEchoueeError extends CodinSchoolError {
  constructor(champs) {
    super('VALIDATION_ECHOUEE', 'Un ou plusieurs champs sont invalides.', { champs })
  }
}

export class UtilisateurNonTrouveError extends CodinSchoolError {
  constructor(id) {
    super('UTILISATEUR_NON_TROUVE', `L'Utilisateur « ${id} » n'a pas été trouvé.`, { id })
  }
}
