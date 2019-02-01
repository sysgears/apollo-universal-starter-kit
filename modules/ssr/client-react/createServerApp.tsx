import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { StaticRouter } from 'react-router';
import { SchemaLink } from 'apollo-link-schema';
import { Provider } from 'react-redux';
import { GraphQLSchema } from 'graphql';
import ClientModule from '@gqlapp/module-client-react';
import ServerModule from '@gqlapp/module-server-ts';
import { isApiExternal, apiUrl } from '@gqlapp/core-common';
import { createApolloClient, createReduxStore } from '@gqlapp/core-common';

let clientModules: ClientModule;

if (__SSR__) {
  clientModules = require('../../../packages/client/src').default;

  if (module.hot) {
    module.hot.accept(['../../../packages/client/src'], () => {
      clientModules = require('../../../packages/client/src').default;
    });
  }
}

const createServerApp = async (req: any, res: any, schema: GraphQLSchema, modules: ServerModule) => {
  const schemaLink = new SchemaLink({
    context: { ...(await modules.createContext(req, res)), req, res },
    schema
  });

  const client = createApolloClient({
    createNetLink: !isApiExternal ? () => schemaLink : undefined,
    clientResolvers: clientModules.resolvers,
    links: clientModules.link,
    connectionParams: null,
    apiUrl
  });

  const store = createReduxStore(clientModules.reducers, {}, client);
  const context: any = {};

  const App = clientModules.getWrappedRoot(
    <Provider store={store}>
      <ApolloProvider client={client}>
        {clientModules.getDataRoot(
          <StaticRouter location={req.url} context={context}>
            {clientModules.router}
          </StaticRouter>
        )}
      </ApolloProvider>
    </Provider>,
    req
  );

  return {
    schemaLink,
    context,
    client,
    store,
    App
  };
};

export default createServerApp;
