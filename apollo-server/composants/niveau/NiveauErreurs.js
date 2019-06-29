import CodinSchoolError from '../erreur'

export class NiveauExistantError extends CodinSchoolError {
  constructor(id) {
    super('NIVEAU_EXISTANT', `Le Niveau « ${id} » existe déjà.`, { id })
  }
}

export class NiveauNonTrouveError extends CodinSchoolError {
  constructor(id) {
    super('NIVEAU_NON_TROUVE', `Le Niveau « ${id} » n'a pas été trouvé.`, { id })
  }
}

export class ListeIDsNiveauxInvalideError extends CodinSchoolError {
  constructor(nonTrouves, manquants, tous) {
    super(
      'NIVEAUX_LISTE_INVALIDE',
      'Certains identifiants de Niveaux sont manquants ou non associés. Vous devez spécifier uniquement tous les identifiants de Niveaux de CodinSchool.',
      {
        nonTrouves,
        manquants,
        tous
      }
    )
  }
}
