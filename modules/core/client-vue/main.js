import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './App.vue';

Vue.use(Vuex);
Vue.use(VueRouter);

export default ({ modules, routes }) => {
  new Vue({
    store: new Vuex.Store({ modules }),
    router: new VueRouter({ routes }),
    render: h => h(App)
  }).$mount('#root');
};
