import ApolloClient from 'apollo-client';
import Vue from 'vue';
import Vuex, { ModuleTree } from 'vuex';
import VueRouter, { RouteConfig } from 'vue-router';
import VueApollo from 'vue-apollo';
import { sync } from 'vuex-router-sync';
import { log } from '@gqlapp/core-common';

import App from './App.vue';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueApollo);

const initWebpackHMR = (entryModule: NodeModule, vm: Vue) => {
  if (entryModule.hot) {
    if (__CLIENT__) {
      entryModule.hot.accept();
    }
    if (entryModule.hot.data) {
      log.debug('Updating front-end');
      (vm.$refs.root as any).reloadFronted();
    }
  }
};

export default (entryModule: NodeModule, stores: ModuleTree<any>, routes: RouteConfig[], client: ApolloClient<any>) => {
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
  initWebpackHMR(entryModule, app);

  return {
    app,
    store,
    router
  };
};
