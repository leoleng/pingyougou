module.exports = {
    chainWebpack: config => {
        //判断是不是发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
                //将入口js文件设置为main-prod.js
                config.entry('app').clear().add('./src/main-prod.js')

                config.set('externals', {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    axios: 'axios',
                    lodash: '_',
                    echarts: 'echarts',
                    nprogress: 'NProgress',
                    'vue-quill-editor': 'VueQuillEditor'
                })
            })
            //使用externals设置排除项
            //当项目中使用import来引入下面这些项目的时候，不会真正的去引用
            //而是去全局的window中查找对应的对象来使用
        config.when(process.env.NODE_ENV === 'development', config => {
            //将入口js文件设置为main-prod.js
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                //添加参数isProd
                args[0].isProd = false
                return args
            })
        })
    }
}