const requireModule = require('esm')(module)

const { ACTIVER_MOCKS } = requireModule('./apollo-server/composants/config')

module.exports = {
  pluginOptions: {
    apollo: {
      enableMocks: ACTIVER_MOCKS,
      enableEngine: false
    }
  }
}
