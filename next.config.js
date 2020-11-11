// @zeit/next-plugins中可以查找到相关文档
const withCss = require('@zeit/next-css')
const webpack = require('webpack')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')

const config = require('./config')

// 可配置项
const configs = {
    // 编译文件输出目录,默认是.next
    distDir: 'dest',
    // 是否给每个路由生成Etag，用来进行缓存验证，nginx中有缓存配置时可以不开启
    generateEtags: true,
    // 本地开发时，页面内容缓存配置
    onDemandEntries: {
        // 内容在内存中缓存时间(ms)
        maxInactiveAge: 25 * 1000,
        // 同时缓存多少个页面
        pagesBufferLength: 2
    },
    // page目录下哪些后缀是页面
    pageExtensions: ['jsx', 'js'],
    // 配置buildId
    generateBuildId: async () => {
        if(process.env.YOUR_BUILD_ID) {
        return process.env.YOUR_BUILD_ID
        }
        // 返回Null使用默认的unique id
        return null
    },

    // 收到修改webpack config
    webpack(config, options) {
        return config
    },

    // 修改webpackDevMiddleware配置
    webpackDevMiddleware: config => {
        return config
    },
        
    // 可以在页面上通过 procsess.env.customKey 获取 value
    env: {
        customKey: 'value',
    },

    // 下面两个通过'next/config'来读取
    // 只有在服务器渲染时才会获取配置
    serverRuntimeConfig: {
        mySecret: 'secret',
        secondSecret: process.env.SECOND_SECRET
    },

    // 在服务端渲染和客户端渲染都可获取的配置
    publicRuntimeConfig: {
        staticFolder: '/static'
    }
}

if(typeof require !== 'undefined') {
    require.extensions['css'] = file => {}
}
// withCss()会增加webpack对css的配置，传入要修改的config，withCss会生成一个config对象
// 传入{webpack(){}}可以修改webpack的配置，可以参考node_modules中插件的源码
module.exports = withBundleAnalyzer(withCss({
    publicRuntimeConfig: {
        OAUTH_URL: config.OAUTH_URL
    },
    webpack(config) {
        // 忽略mement中的语言包，可以在使用的地方单独引入
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/,/moment$/))
        return config
    },
    // 分析打包出的js的依赖关系
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
        // 设置文件路径
        server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html'
        },
        browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html'
        }
    }
}))