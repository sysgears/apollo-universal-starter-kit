import React from 'react';
import PropTypes from 'prop-types';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

const ref = React.createRef();

const clearApolloStoreAndReloadComponent = async client => {
  await client.clearStore();
  ref.current.reloadPage();
};

const login = () => {
  ref.current.reloadPage();
};

const logout = async client => {
  clearApolloStoreAndReloadComponent(client);
};

const logoutFromAllDevices = async client => {
  clearApolloStoreAndReloadComponent(client);
};

class PageReloader extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.subscription = null;
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
  children: PropTypes.node,
  currentUser: PropTypes.object,
  client: PropTypes.object,
  subscribeToMore: PropTypes.func
};

const AuthPageReloader = ({ children, ...props }) => {
  return (
    <PageReloader ref={ref} {...props}>
      {children}
    </PageReloader>
  );
};

AuthPageReloader.propTypes = {
  children: PropTypes.node
};

export default new AccessModule(session, jwt, {
  dataRootComponent: [AuthPageReloader],
  login: [login],
  logout: [logout],
  logoutFromAllDevices: [logoutFromAllDevices]
});
