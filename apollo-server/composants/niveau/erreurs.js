import CodinSchoolError from '../erreur'

export class NiveauNonTrouveError extends CodinSchoolError {
  constructor(id) {
    super('NIVEAU_NON_TROUVE', `Le Niveau « ${id} » n'a pas été trouvé.`, { id })
  }
}

export class NiveauxNonTrouvesError extends CodinSchoolError {
  constructor(nonTrouves, tous) {
    super('NIVEAUX_NON_TROUVES', 'Certains Niveaux n\'a pas été trouvés.', { manquants: nonTrouves, niveaux: tous })
  }
}

export class NiveauxManquantsError extends CodinSchoolError {
  constructor(tous) {
    super('NIVEAUX_MANQUANTS', 'Certains Niveaux sont manquants. Vous devez spécifier le nouvel ordre de tous les Niveaux.', { niveaux: tous })
  }
}
