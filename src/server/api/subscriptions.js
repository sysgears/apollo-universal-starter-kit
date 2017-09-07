import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import jwt from 'jsonwebtoken';

import schema from './schema';
import log from '../../common/log';
import modules from '../../server/modules';
import { refreshTokens } from '../modules/user/auth';

var subscriptionServer;

const addSubscriptions = (httpServer, SECRET) => {
  subscriptionServer = SubscriptionServer.create({
    schema,
    execute,
    subscribe,
    onConnect: async (connectionParams) => {
      let tokenUser = null;

      if (connectionParams && connectionParams.token) {
        try {
          const { user } = jwt.verify(connectionParams.token, SECRET);
          tokenUser = user;
        } catch (err) {
          const newTokens = await refreshTokens(
            connectionParams.token,
            connectionParams.refreshToken,
            modules.createContext().User,
            SECRET,
          );
          tokenUser = newTokens.user;
        }
      }

      return {
        ...modules.createContext(),
        user: tokenUser,
        SECRET
      };
    }
  },
  {
    server: httpServer,
    path: '/graphql',
  });
};

const addGraphQLSubscriptions = (httpServer, SECRET) => {
  if (module.hot && module.hot.data) {
    const prevServer = module.hot.data.subscriptionServer;
    if (prevServer && prevServer.wsServer) {
      log.debug('Reloading the subscription server.');
      prevServer.wsServer.close(() => {
        addSubscriptions(httpServer, SECRET);
      });
    }
  } else {
    addSubscriptions(httpServer, SECRET);
  }
};

if (module.hot) {
  module.hot.dispose(data => {
    try {
      data.subscriptionServer = subscriptionServer;
    } catch (error) {
      log(error.stack);
    }
  });
}

export default addGraphQLSubscriptions;
