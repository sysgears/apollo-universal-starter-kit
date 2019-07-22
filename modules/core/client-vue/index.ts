import ClientModule from '@gqlapp/module-client-vue';
import { createApolloClient, apiUrl, log } from '@gqlapp/core-common';
import settings from '@gqlapp/config';

import createApp from './createApp';

if (!__TEST__ || settings.app.logging.level === 'debug') {
  log.info(`Connecting to GraphQL backend at: ${apiUrl}`);
}

const onAppCreate = async (modules: ClientModule, entryModule: NodeModule) => {
  const { createNetLink, createLink, connectionParams, resolvers, reducers, routes } = modules;

  const client = createApolloClient({
    apiUrl,
    createNetLink,
    createLink,
    connectionParams,
    clientResolvers: resolvers
  });

  const { app } = createApp(entryModule, reducers, routes, client);

  app.$mount('#root');
};

export { default as createApp } from './createApp';

export default new ClientModule({
  onAppCreate: [onAppCreate]
});
