const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  chainWebpack(config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
  }
}
