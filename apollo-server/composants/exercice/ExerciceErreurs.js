import CodinSchoolError from '../erreur'

export class ExerciceNonTrouveError extends CodinSchoolError {
  constructor(id) {
    super('EXERCICE_NON_TROUVE', `L'exercice « ${id} » n'a pas été trouvé.`, { id })
  }
}
