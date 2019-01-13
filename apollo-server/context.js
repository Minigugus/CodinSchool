import authentifier from './composants/auth'

const auth = req => {
  if (req) {
    const autorisation = req.headers.authorization
    if (autorisation) return authentifier(autorisation)
  }
  return null
}

// Context passed to all resolvers (third argument)
// req => Query
// connection => Subscription
// eslint-disable-next-line no-unused-vars
export default async ({ req, connection }) => ({
  req,
  connection,
  utilisateur: await auth(req)
})
