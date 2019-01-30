import ApolloClient from 'apollo-client';
import Vue from 'vue';
import Vuex, { ModuleTree } from 'vuex';
import VueRouter, { RouteConfig } from 'vue-router';
import VueApollo from 'vue-apollo';
import { sync } from 'vuex-router-sync';

import App from './App';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueApollo);

export default (stores: ModuleTree<any>, routes: RouteConfig[], client: ApolloClient<any>) => {
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
