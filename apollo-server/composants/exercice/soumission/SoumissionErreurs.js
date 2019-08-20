import CodinSchoolError from '../../erreur'

export class SoumissionNonTrouveError extends CodinSchoolError {
  constructor(id) {
    super('SOUMISSION_NON_TROUVE', `La Soumission « ${id} » n'a pas été trouvé.`, { id })
  }
}
