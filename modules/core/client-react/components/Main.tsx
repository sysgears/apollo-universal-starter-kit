import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import { RedBox } from '.';

class ServerError extends Error {
  constructor(error: any) {
    super();
    for (const key of Object.getOwnPropertyNames(error)) {
      this[key] = error[key];
    }
    this.name = 'ServerError';
  }
}

interface MainState {
  error?: ServerError;
  info?: any;
  ready?: boolean;
}

export default class extends React.Component<any, MainState> {
  constructor(props: any) {
    super(props);
    const serverError = window.__SERVER_ERROR__;
    serverError ? (this.state = { error: new ServerError(serverError), ready: true }) : (this.state = {});
  }

  public componentDidCatch(error: ServerError, info: any) {
    this.setState({ error, info });
  }

  public render() {
    const { data, history } = this.props;
    return this.state.error ? (
      <RedBox error={this.state.error} />
    ) : (
      data.modules.getWrappedRoot(
        <Provider store={data.store}>
          <ApolloProvider client={data.client}>
            {data.modules.getDataRoot(<ConnectedRouter history={history}>{data.modules.router}</ConnectedRouter>)}
          </ApolloProvider>
        </Provider>
      )
    );
  }
}
