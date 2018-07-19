const path = require('path')
module.exports = {
  productionSourceMap: false,
  lintOnSave: true,
  outputDir: path.resolve(__dirname, "./app/public")
}