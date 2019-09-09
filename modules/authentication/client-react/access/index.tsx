import React from 'react';
import { ApolloClient } from 'apollo-client';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

const ref = React.createRef<PageReloader>();

const resetApolloCacheAndRerenderApp = async (client: ApolloClient<any>) => {
  await client.clearStore();
  ref.current.reloadPage();
};

const login = async (client: ApolloClient<any>) => {
  await resetApolloCacheAndRerenderApp(client);
};

const logout = async (client: ApolloClient<any>) => {
  await resetApolloCacheAndRerenderApp(client);
};

interface PageReloaderProps {
  children: React.ReactElement;
}

class PageReloader extends React.Component<PageReloaderProps> {
  public state = {
    key: 1
  };
  constructor(props: PageReloaderProps) {
    super(props);
  }

  public reloadPage() {
    this.setState({ key: this.state.key + 1 });
  }

  public render() {
    return React.cloneElement(this.props.children, { key: this.state.key });
  }
}

interface AuthPageReloaderProps {
  children: React.ReactElement;
}

const AuthPageReloader = ({ children }: AuthPageReloaderProps) => <PageReloader ref={ref}>{children}</PageReloader>;

export { default as LOGOUT } from './session/graphql/Logout.graphql';

export default new AccessModule(jwt, session, {
  dataRootComponent: [AuthPageReloader],
  login: [login],
  logout: [logout]
});
