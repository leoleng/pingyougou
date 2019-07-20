import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import NProgress from 'nprogress'
import "nprogress/nprogress.css"

import axios from 'axios'

import TreeTable from 'vue-table-with-tree-grid'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//在请求拦截器中给每次发送请求的request添加令牌
axios.interceptors.request.use(function(config) {
    NProgress.start()
        // console.log(config.url)
        //添加Authorization这个令牌字段
    config.headers.Authorization = sessionStorage.getItem("token");
    return config;
})

axios.interceptors.response.use(function(config) {
    NProgress.done()
    return config;
})
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(VueQuillEditor)
Vue.component("tree-table", TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')