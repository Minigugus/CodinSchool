import CodinSchoolError from '../erreur'

export class AuthentificationRequiseError extends CodinSchoolError {
  constructor() {
    super('AUTH_REQUISE', 'Cette requête requière une authentification.')
  }
}

export class AccesInterditError extends CodinSchoolError {
  constructor(permissionsManquantes) {
    super('ACCES_REFUSE', 'Droits d\'accès insuffisants.', { requis: permissionsManquantes })
  }
}
