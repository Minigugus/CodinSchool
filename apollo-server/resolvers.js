import deepmerge from 'deepmerge';

import Authentification from './composants/auth'

export default deepmerge.all([
  { Query: { }, Mutation: { } },

  Authentification
])
