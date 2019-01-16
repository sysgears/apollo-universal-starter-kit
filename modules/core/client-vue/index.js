import ClientModule from '@module/module-client-vue';
import { createApolloClient, apiUrl, log } from '@module/core-common';

// Virtual module, generated in-memory by spin.js, contains count of back-end rebuilds
// eslint-disable-next-line
import 'backend_reload';

import renderApp from './main';

log.info(`Connecting to GraphQL back-end at: ${apiUrl}`);

const createApp = modules => {
  console.log('============= modules : ', modules);

  const client = createApolloClient({
    apiUrl,
    createNetLink: modules.createNetLink,
    links: modules.link,
    connectionParams: modules.connectionParams,
    clientResolvers: modules.resolvers
  });

  const storeModules = Object.keys(modules.reducers).reduce(
    (store, value) => ({ ...store, [value]: modules.reducers[value] }),
    {}
  );

  renderApp({ modules: storeModules, routes: modules.routes, client });
};

if (__DEV__) {
  if (module.hot) {
    module.hot.accept();

    module.hot.accept('backend_reload', () => {
      log.debug('Reloading front-end');
      window.location.reload();
    });
  }
}

export default new ClientModule({
  onAppCreate: [createApp]
});
