import CodinSchoolError from '../erreur'

export class RoleExistantError extends CodinSchoolError {
  constructor(id) {
    super('ROLE_EXISTANT', `Le Role « ${id} » existe déjà.`, { id })
  }
}

export class RoleNonTrouveError extends CodinSchoolError {
  constructor(id) {
    super('ROLE_NON_TROUVE', `Le Role « ${id} » n'a pas été trouvé.`, { id })
  }
}
