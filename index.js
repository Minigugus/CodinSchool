import express from 'express'

import serveur from './apollo-server'
import configServer from './apollo-server/server.js'
import { PORT } from './apollo-server/composants/config'

const app = express()

serveur.applyMiddleware({ app })

configServer(app)

app.listen(PORT, () =>
  console.info(`Serveur lancé sur le port at http://localhost:${PORT}${serveur.graphqlPath}`)
)
