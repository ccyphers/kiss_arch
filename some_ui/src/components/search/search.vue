<template>
  <div>
  <div v-bind:class="{ results: search.state.results.length > 0, form: search.state.results.length === 0 }">
    <ui-textbox
      class="search-input"
      floating-label
      label="Google Ripoff"
      placeholder="What do you want to rip off of google?"
      v-model="term"
    ></ui-textbox>
    <ui-button icon="refresh" v-on:click="find">Search</ui-button>

  </div>
  <search-results :results="search.state.results"></search-results>
  </div>
</template>

<script>
import search from '../../models/search';

export default {
  name: 'search',
  methods: {
    find() {
      this.search.dispatch('search', { term: this.term });
    },
  },
  data() {
    return {
      search,
      term: '',
    };
  },

};
</script>

<style scoped>
.results {
  display: flex;
  justify-content: space-between;
  max-width: 450px;
  margin: 0 auto;


}

.results > .search-input {
  width: 300px;
}

.form {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  justify-content: center;
  height: 100vh;
  max-width: 400px;
}
</style>
