import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueApollo from 'vue-apollo';
import App from './App.vue';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueApollo);

export default ({ modules, routes, client }) => {
  new Vue({
    store: new Vuex.Store({ modules }),
    router: new VueRouter({ routes }),
    apolloProvider: new VueApollo({ defaultClient: client }),
    render: h => h(App)
  }).$mount('#root');
};
