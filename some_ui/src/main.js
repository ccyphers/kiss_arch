// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import KeenUI from 'keen-ui';
import VueResource from 'vue-resource';
import config from 'config';
import App from './App';
import SearchResults from './components/search/results';
import router from './router';

require('../node_modules/keen-ui/dist/keen-ui.min.css');

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(KeenUI);
Vue.config.productionTip = false;

Vue.component('search-results', SearchResults);

Vue.http.interceptors.push((req, next) => {
  const token = sessionStorage.getItem('token');
  req.headers.set('Authorization', `Bearer ${token}`);
  next((res) => {
    if (res.status === 401 || res.status === 403) {
      sessionStorage.setItem('returnTo', `${config.appRoot}${location.hash}`);
      location.href = `${config.appRoot}#/login`;
    }
  });
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
