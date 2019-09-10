import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import ErrorApp from '@/views/ErrorApp.vue'
/* Layout */
import Login from '@/views/Login.vue'

Vue.use(Router)
// const Login = { template: '<div><login/></div>' };
// const Home = { template: '<div><tp-layout/></div>' };
export default new Router({
    //mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        name: 'h',
        component: Home
    }, {
        path: '/error',
        name: 'errorApp',
        component: ErrorApp
    }, {
        path: '/home',
        name: 'home',
        component: Home
    }, {
        path: '/login',
        name: 'login',
        component: Login
    }, {
        path: '/sys',
        name: 'sys',
        component: Home,
        children: [{
            name: 'taskApp',
            path: 'saa/task_app',
            component: () => import('@/views/test/TestApp.vue')
        }]
    }, {
        path: '/test',
        name: 'test',
        component: Home,
        children: [{
            name: 'testApp',
            path: 'test/test_app',
            component: () => import('@/views/test/TestApp.vue')
        }]
    }]
});