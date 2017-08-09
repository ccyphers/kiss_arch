import config from 'config';

const Vue = require('vue').default;

const Vuex = require('vuex').default;

Vue.use(Vuex);

const state = {};

const mutations = {
  set(s, token) {
    sessionStorage.setItem('token', token);
    const returnTo = sessionStorage.getItem('returnTo');
    location.href = returnTo;
  },
};

const actions = {
  login(context, ops) {
    const postData = { username: ops.username, password: ops.password };
    Vue.http.post(`${config.apiHost}/api/login`, postData)
      .then((response) => {
        context.commit('set', response.body);
      });
  },

};

export default new Vuex.Store({
  state,
  mutations,
  actions,
});
