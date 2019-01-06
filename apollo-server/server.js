import path from 'path'
import express from 'express'

import { SERVIR_FICHIERS_STATIQUES } from './composants/config'

export default app => {
  // app.use('/files', express.static(path.resolve(__dirname, '../live/uploads')))
  if (SERVIR_FICHIERS_STATIQUES)
    app.use('/', express.static(path.resolve(__dirname, '../dist')))
}
