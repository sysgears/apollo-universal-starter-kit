import React from 'react';
import { LogBox } from 'react-native';
import { ApolloProvider } from 'react-apollo';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import url from 'url';

import ClientModule from '@gqlapp/module-client-react-native';
import { createApolloClient, log } from '@gqlapp/core-common';
import settings from '@gqlapp/config';

const { protocol, pathname, port } = url.parse(__API_URL__);

interface MainProps {
  children?: any;
  exp: any;
  modules: ClientModule;
}

export default class Main extends React.Component<MainProps> {
  public componentDidMount() {
    LogBox.ignoreLogs([
      'Animated: `useNativeDriver`',
      'Animated.event now requires',
      'ViewPropTypes will be removed from React Native',
    ]);
  }

  public render() {
    const { hostname } = url.parse(__API_URL__);
    const { modules } = this.props;
    const manifest = JSON.parse(this.props.exp.manifestString);
    const apiUrl =
      manifest.bundleUrl && hostname === 'localhost'
        ? `${protocol}//${url.parse(manifest.bundleUrl).hostname}:${port}${pathname}`
        : __API_URL__;
    const store = createStore(
      Object.keys(modules.reducers).length > 0
        ? combineReducers({
            ...modules.reducers,
          })
        : (state) => state,
      {} // initial state
    );
    const client = createApolloClient({
      apiUrl,
      createNetLink: modules.createNetLink,
      createLink: modules.createLink,
      connectionParams: modules.connectionParams,
      clientResolvers: modules.resolvers,
    });

    if (!__TEST__ || settings.app.logging.level === 'debug') {
      log.info(`Connecting to GraphQL backend at: ${apiUrl}`);
    }

    return modules.getWrappedRoot(
      <Provider store={store}>
        <ApolloProvider client={client}>{modules.getDataRoot(modules.router)}</ApolloProvider>
      </Provider>
    );
  }
}
