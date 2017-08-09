import Vue from 'vue';
import Router from 'vue-router';
import Search from '@/components/search/search';
import Login from '@/components/login/login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'search',
      component: Search,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});
