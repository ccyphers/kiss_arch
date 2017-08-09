<template>
  <div class="login-form">
    <ui-textbox
      floating-label
      label="Username"
      placeholder="Enter your username"
      v-model="username"
    ></ui-textbox>
    <ui-textbox
      floating-label
      label="Password"
      type="password"
      placeholder="Enter your password"
      v-model="password"
    ></ui-textbox>
    <ui-button icon="refresh" v-on:click="auth">Login</ui-button>

  </div>
</template>

<script>
import login from '../../models/login';

const Vue = require('vue').default;

const Vuex = require('vuex').default;

Vue.use(Vuex);

export default {
  name: 'login',
  methods: {
    auth() {
      this.login.dispatch('login', { username: this.username, password: this.password });
    },
  },
  data() {
    return {
      login,
      username: '',
      password: '',
    };
  },

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}


.login-form {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    justify-content: center;
    height: 100vh;
    max-width: 400px;
}


a {
  color: #42b983;
}
.errors {
  color: red;
}
.action-controls {
  display: flex;
}
</style>
