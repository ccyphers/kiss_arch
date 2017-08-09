import config from 'config';

const Vue = require('vue').default;

const Vuex = require('vuex').default;

Vue.use(Vuex);

const state = {
  results: [],
};

const mutations = {
  set(s, results) {
    const s2 = s;
    s2.results = results;
    // console.log(results);
    // debugger;
  },
};

const actions = {
  search(context, ops) {
    Vue.http.get(`${config.apiHost}/api/search?term=${ops.term}`)
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
