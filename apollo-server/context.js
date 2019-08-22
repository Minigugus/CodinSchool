import authentifier from './composants/auth'

const auth = async (req, connection) => {
  try {
    const autorisation = req ? req.headers.authorization : connection.authorization
    if (autorisation && /^Bearer /.test(autorisation))
      return await authentifier(autorisation.slice(7))
  }
  catch (err) {
    // console.warn('Erreur lors du décodage du jeton d\'authentification : %s', err)
  }
  return null
}

// Context passed to all resolvers (third argument)
// req => Query
// connection => Subscription
// eslint-disable-next-line no-unused-vars
export default async ({ req, connection }) => connection && connection.context ? connection.context : ({
  req,
  connection,
  utilisateur: await auth(req, connection)
})
