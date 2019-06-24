import { ApolloError } from 'apollo-server-express'

import { MODE_DEVELOPPEMENT } from '../config'

export default class CodinSchoolError extends ApolloError {
  constructor(code, message, props, details) {
    super(message, code, { ...props, details: MODE_DEVELOPPEMENT ? details : undefined })
  }
}

export class ErreurInattendueError extends CodinSchoolError {
  constructor(code, details = {}) {
    super(
      'ERREUR_INATTENDUE',
      'Une erreur inattendue est survenue. Merci de réessayer plus tard.',
      null,
      { code, ...details }
    )
  }
}
