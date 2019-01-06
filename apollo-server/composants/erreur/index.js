import { ApolloError } from 'apollo-server-express'

import { MODE_DEVELOPPEMENT } from '../config'

export default class CodinSchoolError extends ApolloError {
  constructor(code, message, props, details) {
    super(message, code, { props, details: MODE_DEVELOPPEMENT ? details : undefined })
    // if (MODE_DEVELOPPEMENT)
    //   Error.captureStackTrace(this);
  }
}

export class ErreurInattendueError extends CodinSchoolError {
  constructor(code, details = {}) {
    super('ERREUR_INATTENDUE', 'Un erreur inattendue est survenue. Merci de réessayer plus tard.', null, { code, ...details })
  }
}
