module.exports = {
  pluginOptions: {
    apollo: {
      enableMocks: process.env.NODE_ENV !== 'production',
      enableEngine: false
    }
  }
}
