import deepmerge from 'deepmerge'

import Niveau from './composants/niveau/resolvers.js'
import Exercice from './composants/exercice/resolvers.js'
import Authentification from './composants/auth/resolvers.js'

export default deepmerge.all([
  { Query: {}, Mutation: {} },

  Niveau,
  Exercice,
  Authentification
])
