import ClientModule from '@module/module-client-vue';
import { createApolloClient, apiUrl, log } from '@module/core-common';

// Virtual module, generated in-memory by spin.js, contains count of back-end rebuilds
// eslint-disable-next-line
// import 'backend_reload';

import createApp from './createApp';

log.info(`Connecting to GraphQL back-end at: ${apiUrl}`);

const onAppCreate = ({ createNetLink, link, connectionParams, resolvers, reducers, routes }) => {
  const client = createApolloClient({
    apiUrl,
    createNetLink,
    links: link,
    connectionParams,
    clientResolvers: resolvers
  });

  const stores = Object.keys(reducers).reduce((store, value) => ({ ...store, [value]: reducers[value] }), {});

  const { app, store, router } = createApp({ stores, routes, client });

  if (window.__APOLLO_STATE__) {
    store.replaceState(window.__APOLLO_STATE__);
  }

  router.onReady(() => {
    router.beforeResolve((to, from, next) => {
      let diffed = false;
      const matched = router.getMatchedComponents(to);
      const prevMatched = router.getMatchedComponents(from);
      const activated = matched.filter((c, i) => diffed || (diffed = prevMatched[i] !== c));
      const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);

      if (!asyncDataHooks.length) {
        return next();
      }

      Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
        .then(next)
        .catch(next);
    });

    app.$mount('#root');
  });
};

// if (__DEV__) {
//   if (module.hot) {
//     module.hot.accept();

//     module.hot.accept('backend_reload', () => {
//       log.debug('Reloading front-end');
//       window.location.reload();
//     });
//   }
// }

export { default as createApp } from './createApp';

export default new ClientModule({
  onAppCreate: [onAppCreate]
});
