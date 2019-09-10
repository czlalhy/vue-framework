
const Login = { template: '<div><tp-login/></div>' };
const Home = { template: '<div><tp-layout/></div>' };
const ErrorApp = { template: '<div><p class="page-container">您没有权限或者路由不存在，请联系管理员!</p></div>' };
const Note = { template: '<div>Note</div>' };
export default [{
    path: '/login',
    component: Login
}, {
    path: '/home',
    component: Home,
    children: [{
        path: 'note',
        name: 'homeAppNote',
        component: Note
    }]
}, {
    path: '/',
    component: Home
}, {
    path: '/error',
    component: ErrorApp
}, {
    path: '*',
    component: ErrorApp
}];