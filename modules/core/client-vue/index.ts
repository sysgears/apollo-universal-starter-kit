import ClientModule from '@gqlapp/module-client-vue';
import { createApolloClient, apiUrl, log } from '@gqlapp/core-common';

import createApp from './createApp';

log.info(`Connecting to GraphQL back-end at: ${apiUrl}`);

const onAppCreate = ({ createNetLink, link, connectionParams, resolvers, reducers, routes }: ClientModule) => {
  const client = createApolloClient({
    apiUrl,
    createNetLink,
    links: link,
    connectionParams,
    clientResolvers: resolvers
  });

  const { app } = createApp(reducers, routes, client);

  app.$mount('#root');
};

export { default as createApp } from './createApp';

export default new ClientModule({
  onAppCreate: [onAppCreate]
});
