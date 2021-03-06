'use strict'
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path');
let envHost=require('./prod.env')

let HOST=process.env.HOST; 
let HostState=envHost.HOST==='"prod"'?false:true;;
console.log(HostState)
let buildIndex="../dist/index.html";
let buildAssetsRoot="../dist";
let buildAssetsPublicPath="/modules/wx/"; 
if(HostState){
  buildIndex="../../../../aqskclound/dist/index.html";
  buildAssetsRoot="../../../../aqskclound/dist";
  buildAssetsPublicPath=" ./"; 
}
module.exports = {
 
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/wx/api/': {
        //target:'http://192.168.183.80:8082',//如意本地
          target:'http://192.168.193.107:8082',//测试
      // target:'http://192.168.193.115:8082',//正式
      changeOrigin: true, 
      pathRewrite: {
        '^/': '/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/insure/api/user/add’即可
      }
    },
    '/agile-bpm-platform/':{
     //target:'http://192.168.183.80:8082',//如意本地
         target:'http://192.168.193.107:8082',//测试
    //  target:'http://192.168.193.115:8082',//正式
      changeOrigin: true,   
      pathRewrite: {
        '^/': '/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/insure/api/user/add’即可
      },
    }
    },
    // Various Dev Server settings
    host: '127.0.0.1', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,
    /**
     * Source Maps
     */
    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },
  
  build: { 
  
    // Template for index.html
    index: path.resolve(__dirname,buildIndex), // ../../../../aqskclound/dist/index.html
    // Paths
    assetsRoot: path.resolve(__dirname,buildAssetsRoot),  //  ../../../../aqskclound/dist/index.html
    assetsSubDirectory: 'static',
    assetsPublicPath:buildAssetsPublicPath,   //   /modules/wx/
    /**
     * Source Maps
     */
    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
} 