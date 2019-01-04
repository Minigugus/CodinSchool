import Profile from './Profile'

import auth from '../../utils/auth'

export default class Utilisateur {
  constructor(id) {
    this.id = id
  }

  jeton({ id }) {
    return auth.creerJeton({ id })
  }

  profile({ id }) {
    return Profile.recupererParID(id)
  }
}
