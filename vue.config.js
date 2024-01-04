const path = require('path')

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      // 即为自动导入的less文件
      // 注意：这里要使用绝对路径
      // 文件拼接使用join.path()
      patterns: [
        path.join(__dirname, './src/assets/style/mixins.less'),
        path.join(__dirname, './src/assets/style/variables.less')
      ]
    }
  },
  // # 这个是设置外部扩展，模块为qc变量名为QC，导入qc将不做打包。
  configureWebpack: {
    externals: {
      qc: 'QC'
    }
  }
})
