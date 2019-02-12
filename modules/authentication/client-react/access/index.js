import React from 'react';
import PropTypes from 'prop-types';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

const ref = React.createRef();

const resetApolloCacheAndRerenderApp = async client => {
  // We use `client.cache.reset` instead of `client.clearStore`,
  // because client.clearStore cancels all queries that are
  // executing at the moment, as a result error being thrown.

  await client.cache.reset();
  ref.current.reloadPage();
};

const login = async client => {
  await resetApolloCacheAndRerenderApp(client);
};

const logout = async client => {
  await resetApolloCacheAndRerenderApp(client);
};

class PageReloader extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  state = {
    key: 1
  };

  reloadPage() {
    this.setState({ key: this.state.key + 1 });
  }

  render() {
    return React.cloneElement(this.props.children, { key: this.state.key });
  }
}

PageReloader.propTypes = {
  children: PropTypes.node
};

const AuthPageReloader = ({ children }) => <PageReloader ref={ref}>{children}</PageReloader>;

AuthPageReloader.propTypes = {
  children: PropTypes.node
};

export default new AccessModule(jwt, session, {
  dataRootComponent: [AuthPageReloader],
  login: [login],
  logout: [logout]
});
