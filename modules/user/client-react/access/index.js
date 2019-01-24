import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import { getItem, removeItem, setItem } from '@module/core-common/clientStorage';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';
import settings from '../../../../settings';

const ref = React.createRef();

const resetApolloCacheAndRerenderApp = async client => {
  await client.clearStore();
  ref.current.reloadPage();
};

const login = async client => {
  await resetApolloCacheAndRerenderApp(client);
};

const logout = async client => {
  await resetApolloCacheAndRerenderApp(client);
};

const firebaseJwtController = async user => {
  const token = await getItem('idToken');
  if (user) {
    if (!token) {
      const newToken = await user.getIdToken();
      console.log(newToken);
      await setItem('idToken', newToken);
    }
  } else {
    if (token) {
      await removeItem('idToken');
    }
  }
};

class PageReloader extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  state = {
    key: 1
  };

  componentDidMount() {
    if (settings.user.auth.firebase.enabled) {
      firebase.auth().onAuthStateChanged(firebaseJwtController);
    }
  }

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
