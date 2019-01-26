import deepmerge from 'deepmerge'

import Authentification from './composants/auth/resolvers.js'

export default deepmerge.all([{ Query: {}, Mutation: {} }, Authentification])
