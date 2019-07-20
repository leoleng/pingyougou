import Vue from 'vue'
import Router from 'vue-router'

const Login = () =>
    import ( /* webpackChunkName:"login_home_welcome" */ './components/Login.vue')
    // import Login from './components/Login.vue'
const Home = () =>
    import ( /* webpackChunkName:"login_home_welcome" */ './components/Home.vue')
    // import Home from './components/Home.vue'
const Welcome = () =>
    import ( /* webpackChunkName:"login_home_welcome" */ './components/Welcome.vue')
    // import Welcome from './components/Welcome.vue'

const Users = () =>
    import ( /* webpackChunkName:"users_rights_roles" */ './components/User/Users.vue')
    // import Users from './components/User/Users.vue'
const Rights = () =>
    import ( /* webpackChunkName:"users_rights_roles" */ './components/Right/Rights.vue')
    // import Rights from './components/Right/Rights.vue'
const Roles = () =>
    import ( /* webpackChunkName:"users_rights_roles" */ './components/Right/Roles.vue')
    // import Roles from './components/Right/Roles.vue'

const Cate = () =>
    import ( /* webpackChunkName:"cate_params" */ './components/Goods/Cate.vue')
    // import Cate from './components/Goods/Cate.vue'
const Params = () =>
    import ( /* webpackChunkName:"cate_params" */ './components/Goods/Params.vue')
    // import Params from './components/Goods/Params.vue'

const List = () =>
    import ( /* webpackChunkName:"list_add" */ './components/Goods/List.vue')
    // import List from './components/Goods/List.vue'
const Add = () =>
    import ( /* webpackChunkName:"list_add" */ './components/Goods/Add.vue')
    // import Add from './components/Goods/Add.vue'

const Orders = () =>
    import ( /* webpackChunkName:"list_add" */ './components/Order/Orders.vue')
    // import Orders from './components/Order/Orders.vue'
const Reprots = () =>
    import ( /* webpackChunkName:"list_add" */ './components/Reprot/Reprots.vue')
    // import Reprots from './components/Reprot/Reprots.vue'


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
                { path: "/params", component: Params, },
                { path: "/goods", component: List, },
                { path: "/goods/add", component: Add, },
                { path: "/orders", component: Orders, },
                { path: "/reports", component: Reprots, }
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