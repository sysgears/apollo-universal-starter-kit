import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueApollo from 'vue-apollo';
import { sync } from 'vuex-router-sync';
import App from './App.vue';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueApollo);

export default ({ stores, routes, client }) => {
  const router = new VueRouter({ routes });
  const store = new Vuex.Store({ modules: stores });
  const apolloProvider = new VueApollo({ defaultClient: client });

  sync(store, router);

  const app = new Vue({
    router,
    store,
    apolloProvider,
    render: h => h(App)
  });

  return {
    app,
    store,
    router
  };
};
