import config from 'config';

const Vue = require('vue').default;

const Vuex = require('vuex').default;

const sortBy = require('lodash/fp/sortBy');

const groupBy = require('lodash/fp/groupBy');

const map = require('lodash/fp/map');

const flow = require('lodash/fp/flow');

console.log(groupBy);

Vue.use(Vuex);

function displayTime(dt) {
  return `${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`;
}

function getMMDDYYYY(dt) {
  return {
    month: dt.getMonth() + 1,
    day: dt.getDate(),
    year: dt.getFullYear(),
  };
}

function displayDate(startDt, endDt) {
  return `${displayTime(startDt)} - ${displayTime(endDt)}`;
}

const state = {
  moments: [],
  momentDates: [],
  byDate: {},
  imageIDS: [],
  momentErrors: [],
};

const mutations = {
  set(s, items) {
    const s2 = s;

    s2.byDate = flow(groupBy('startDt'))(items);
    s2.momentDates = Object.keys(s2.byDate);
    /*
    s2.moments = items.map((moment) => {
      moment.imageIDS = moment.images.map(image => image.data.id);
      return moment;
    });
    */
  },
  setMomentForDt(s, dt) {
    const s2 = s;
    s2.moments = s2.byDate[dt];
  },
  setMomentErrors(s, items) {
    const s2 = s;
    s2.momentErrors = items;
  },
};

const actions = {
  updateMomentForDate(context, dt) {
    context.commit('setMomentForDt', dt);
  },
  get(context) {
    Vue.http.get(`${config.apiHost}/api/moments`).then((response) => {
      console.log(response);
      try {
        context.commit('set', response.data.data.map((moment) => {
          const start = `${moment.start}Z`;
          const end = `${moment.end}Z`;

          moment.images = flow(
            map((i) => {
              i.data.reported_time = new Date(i.data.reported_time);
              return i;
            }),
            sortBy('data.reported_time'),
          )(moment.images);

          const startDt = new Date(start);
          const endDt = new Date(end);
          const s = getMMDDYYYY(startDt);
          moment.startDt = `${s.month}/${s.day}/${s.year}`;
          // moment.startMMDDYYYY =
          moment.displayLabel = displayDate(startDt, /* eslint no-param-reassign: off */
                                            endDt);

          return moment;
        }));
      } catch (e) {
        context.commit('setMomentErrors', ['Unable to retrieve moments.']);
      }
    });
  },

};

export default new Vuex.Store({
  state,
  mutations,
  actions,
});
