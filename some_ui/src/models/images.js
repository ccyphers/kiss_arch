import config from 'config';

const Vue = require('vue').default;

const Vuex = require('vuex').default;

Vue.use(Vuex);

/*
function displayTime(dt) {
  return `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`;
}
*/

/*
function displayDate(startDt, endDt) {
  const base1 = `${startDt.getMonth() + 1}/${startDt.getDate()}/${startDt.getFullYear()}`;
  const base2 = `${endDt.getMonth() + 1}/${endDt.getDate()}/${endDt.getFullYear()}`;
  let base = base1;
  if (base1 !== base2) {
    base = `${base1} - ${base2}`;
  }

  return `${base}(${displayTime(startDt)} - ${displayTime(endDt)})`;
}
*/

const state = {
  currentImageSrc: '',
  isPlaying: false,
  currentIndex: 0,
  imageIDS: [],
  imageErrors: [],
};

const mutations = {
  set(s, items) {
    const s2 = s;
    s2.images = items;
  },
  setCurrentImageSrc(s, image) {
    const s2 = s;
    s2.currentImageSrc = `data:image/png;base64,${image.content}`;
  },
  setImageErrors(s, items) {
    const s2 = s;
    s2.imageErrors = items;
  },
  incIndex(s, inc) {
    const s2 = s;
    s2.currentIndex += inc;
  },
  setImageIDS(s, ids) {
    const s2 = s;
    s2.imageIDS = ids;
  },
  setIsPlaying(s, v) {
    const s2 = s;
    s2.isPlaying = v;
  },
};

const actions = {
  get(context, imageId) {
    return Vue.http.get(`${config.apiHost}/api/images/${imageId}`).then((response) => {
      console.log(response);
      try {
        context.commit('setCurrentImageSrc', response.data.data);
      } catch (e) {
        context.commit('setImageErrors', ['Unable to retrieve image.']);
      }
    });
  },
  getWithDelay(context, imageId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        actions.get(context, imageId).then(resolve);
      }, 150);
    });
  },
  async play(context) {
    let id;
    context.commit('setIsPlaying', true);
    for (id of state.imageIDS) { // eslint-disable-line no-restricted-syntax
      // eslint-disable-next-line no-await-in-loop
      await actions.getWithDelay(context, id); // eslint-disable-line no-restricted-syntax
    }
    context.commit('setIsPlaying', false);
  },
  setImageIDS(context, ids) {
    context.commit('setImageIDS', ids);
  },
  incWithRefresh(context, inc) {
    context.commit('incIndex', inc);
    const index = context.state.currentIndex;
    const id = context.state.imageIDS[index];
    context.dispatch('get', id);
  },

};

export default {
  state,
  mutations,
  actions,
};
