import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'apollo-token'

// Http endpoint
const httpEndpoint =
  process.env.VUE_APP_GRAPHQL_HTTP ||
  (process.env.NODE_ENV === 'production' ? '/graphql' : 'http://localhost:4000/graphql')
// Files URL root
export const filesRoot =
  process.env.VUE_APP_FILES_ROOT || httpEndpoint.substr(0, httpEndpoint.indexOf('/graphql'))

Vue.prototype.$filesRoot = filesRoot

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  // wsEndpoint: process.env.VUE_APP_GRAPHQL_WS || 'ws://localhost:4000/graphql',
  wsEndpoint: null,
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false,

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  // link: myLink

  // Override default cache
  // cache: myCache

  // Override the way the Authorization header is set
  getAuth: tokenName => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem(tokenName)
    // return the headers to the context so httpLink can read them
    return token || ''
  }

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
}

// Vérifier si l'erreur GraphQL est une erreur de non authentification
function isUnauthorizedError(error) {
  const { graphQLErrors } = error
  return (
    graphQLErrors &&
    graphQLErrors.some(e => e.message === 'Cette requête requière une authentification.')
  )
}

// Call this in the Vue app file
export function createProvider(options = {}, { router }) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options
  })
  apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        fetchPolicy: 'cache-and-network'
      }
    },
    errorHandler(error) {
      if (isUnauthorizedError(error)) {
        // Liste des pages qui ont besoin de connexion
        // TODO: Indiquer les pages qui ont besoin d'être connecté
        const besoinConnexion = ['profil', 'gestioncontenu']
        const res = besoinConnexion.some(x => router.currentRoute.name === x)

        // Rediriger à la page de connexion si page en cours a besoin de connexion
        if (res) router.replace({ name: 'connexion' })
      }
      else {
        console.log(
          '%cError',
          'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;',
          error.message
        )
      }
    }
  })
  return apolloProvider
}

// Appeler cette fonction lors de la connexion
export async function onLogin(apolloClient, token) {
  if (typeof localStorage !== 'undefined' && token) {
    localStorage.setItem(AUTH_TOKEN, token)
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  }
  catch (e) {
    if (!isUnauthorizedError(e))
      console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}

// Appeler cette fonction lors de la déconnexion
export async function onLogout(apolloClient) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN)
  }
  if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
  try {
    await apolloClient.resetStore()
  }
  catch (e) {
    if (!isUnauthorizedError(e))
      console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
  }
}
