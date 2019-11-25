const prefixer = require('autoprefixer')

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          prefixer({})
        ]
      },
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}