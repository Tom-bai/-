import Vue from 'vue'
import Router from 'vue-router'
import Login from './Login/Login.vue'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login,
            meta: {title: '登录'}
        },
        {
            path: '/Home',
            meta: {title: '主页'},
            component: () => import('./Home/Home.vue'),
            children: [
                {
                    path: '/',
                    component: () => import('./Account/Account.vue'),
                    meta: {title: '账户'}
                },
                {
                    path: '/Account',
                    component: () => import('./Account/Account.vue'),
                    name: 'Account',
                    meta: {title: '账户'}
                },
                {
                    path: '/Ranking',
                    component: () => import('./Ranking/Ranking.vue'),
                    name: 'Ranking',
                    meta: {title: '排行榜'}
                },
                {
                    path: '/Transaction',
                    component: () => import('./Transaction/Transaction.vue'),
                    name: 'Transaction',
                    meta: {title: '交易'}
                },
                {
                    path: '/Quotes',
                    component: () => import('./Quotes/Quotes.vue'),
                    name: 'Quotes',
                    meta: {title: '行情'}
                },
                {
                    path: '/Square',
                    component: () => import('./Square/Square.vue'),
                    name: 'Square',
                    meta: {title: '广场'}
                },
                {
                    path: '/Personal',
                    component: () => import('./Personal/Personal.vue'),
                    name: 'Personal',
                    meta: {title: '个人中心'}
                },
                {
                    path: '/Personal/Message',
                    component: () => import('./Personal/Message/Message.vue'),
                    name: 'Personal',
                    meta: {title: '我的消息'}
                },
                {
                    path: '/Personal/Posts',
                    component: () => import('./Personal/Posts/Posts.vue'),
                    name: 'Posts',
                    meta: {title: '我的帖子'}
                },
            ]
        }
    ],
    mode: "history"
})