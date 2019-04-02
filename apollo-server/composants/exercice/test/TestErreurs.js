import CodinSchoolError from '../../erreur'

export class TestNonTrouveError extends CodinSchoolError {
  constructor(id) {
    super('TEST_NON_TROUVE', `Le Test « ${id} » n'a pas été trouvé.`, { id })
  }
}
