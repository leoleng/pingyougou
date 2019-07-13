import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Users from './components/User/Users.vue'
import Rights from './components/Right/Rights.vue'
import Roles from './components/Right/Roles.vue'
import Cate from './components/Goods/Cate.vue'
import Params from './components/Goods/Params.vue'


Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: "/login", component: Login },
        {
            path: "/home",
            component: Home,
            redirect: '/welcome',
            children: [
                { path: "/welcome", component: Welcome, },
                { path: "/users", component: Users, },
                { path: "/rights", component: Rights, },
                { path: "/roles", component: Roles, },
                { path: "/categories", component: Cate, },
                { path: "/params", component: Params, }
            ]
        }
    ]
})

router.beforeEach((to, form, next) => {
    if (to.path === '/login') {
        return next()
    }

    const token = sessionStorage.getItem('token')
    if (!token) {
        return next('/login')
    } else {
        return next()
    }
})
export default router