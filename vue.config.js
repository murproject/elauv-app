const WebpackAutoInject = require('webpack-auto-inject-version');

module.exports = {
  publicPath: '',
  pluginOptions: {
    cordovaPath: 'src-cordova',
  },
  configureWebpack: {
    plugins: [
      new WebpackAutoInject({
        components: {
          AutoIncreaseVersion: false,
          InjectAsComment: false,
          InjectByTag: true,
        },
        componentsOptions: {
          InjectByTag: {
            dateFormat: 'yyyy-mm-dd',
          },
        },
      }),
    ],
  },
};
