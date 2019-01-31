import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import { withApollo } from 'react-apollo';
import { getItem, removeItem, setItem } from '@gqlapp/core-common/clientStorage';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';
import settings from '../../../../settings';
import { clientData } from '../../../../config/firebase';

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

// Initialize Firebase
if (settings.user.auth.firebase.enabled) {
  firebase.initializeApp(clientData);
}

const firebaseJwtController = client => {
  firebase.auth().onAuthStateChanged(async user => {
    const token = await getItem('idToken');
    if (user) {
      if (!token) {
        const newToken = await user.getIdToken();
        await setItem('idToken', newToken);
        await resetApolloCacheAndRerenderApp(client);
      }
    } else {
      if (token) {
        await removeItem('idToken');
      }
    }
  });
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
    const { client } = this.props;
    if (settings.user.auth.firebase.jwt) {
      firebaseJwtController(client);
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
  children: PropTypes.node,
  client: PropTypes.object
};

const AuthPageReloader = ({ children, client }) => (
  <PageReloader client={client} ref={ref}>
    {children}
  </PageReloader>
);

AuthPageReloader.propTypes = {
  children: PropTypes.node,
  client: PropTypes.object
};

export default new AccessModule(jwt, session, {
  dataRootComponent: [withApollo(AuthPageReloader)],
  login: [login],
  logout: [logout]
});
