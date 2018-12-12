import { ApolloServer } from 'apollo-server-express'

import { MODE_DEVELOPPEMENT } from './utils/config.js'

import context from './context.js'
import dataSources from './data-sources.js'
import directives from './directives.js'
import mocks from './mocks.js'
import resolvers from './resolvers.js'
import server from './server.js'
import typeDefs from './type-defs.js'

export default new ApolloServer({
  subscriptions: false,
  cors: !MODE_DEVELOPPEMENT,
  debug: MODE_DEVELOPPEMENT,

  context,
  dataSources,
  schemaDirectives: directives,
  mocks,
  resolvers,
  server,
  typeDefs
})
