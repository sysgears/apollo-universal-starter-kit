import React from 'react';
import PropTypes from 'prop-types';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

import resources from './locales';

const ref = React.createRef();

const resetApolloCache = async client => {
  await client.cache.reset();

  // await client.clearStore();

  console.log('client --->', client);
};

const login = async client => {
  await resetApolloCache(client);
};

const logout = async client => {
  await resetApolloCache(client);
  ref.current.reloadPage();
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
  logout: [logout],
  localization: [{ ns: 'auth', resources }]
});
