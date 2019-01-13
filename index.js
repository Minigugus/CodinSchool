import express from 'express'

import serveur from './apollo-server'
import configServer from './apollo-server/server.js'
import { PORT } from './apollo-server/composants/config'
import { logInfo } from './apollo-server/composants/log'

const app = express()

serveur.applyMiddleware({ app })

configServer(app)
  .then(() =>
    app.listen(PORT, () => logInfo(`Serveur lancé. http://localhost:${PORT}${serveur.graphqlPath}`))
  )
