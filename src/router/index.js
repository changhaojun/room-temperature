import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/components/login/Login';
import Main from '@/components/main/Main';

Vue.use(Router)

export default new Router({
    linkActiveClass: 'active-router',
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },
        {
            path: '/main',
            name: 'Main',
            component: Main,
            children: Main.children
        }
    ]
})
