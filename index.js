import express from 'express'

import serveur from './apollo-server'
import configServer from './apollo-server/server.js'
import bdd from './apollo-server/composants/bdd'
import { PORT } from './apollo-server/composants/config'
import { log_info } from './apollo-server/composants/log'

const app = express()

serveur.applyMiddleware({ app })

configServer(app)

bdd.sync()
.then(() =>
  app.listen(PORT, () =>
    log_info(`Serveur lancé. http://localhost:${PORT}${serveur.graphqlPath}`)
  )
)
