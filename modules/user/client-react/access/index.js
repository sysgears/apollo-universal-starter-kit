import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import { getItem, removeItem } from '@module/core-common/clientStorage';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

// import FIREBASE_LOGIN from '../graphql/FirebaseLogin.graphql';

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

const firebaseLogin = async email => {
  console.log('email', email);
};

const firebaseSession = async user => {
  const token = await getItem('refreshToken');
  if (user) {
    if (!token) {
      firebaseLogin(user.email);
    }
  } else {
    if (token) {
      await removeItem('refreshToken');
      await removeItem('accessToken');
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
    firebase.auth().onAuthStateChanged(firebaseSession);
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
