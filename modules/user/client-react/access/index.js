import React from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import jwt from './jwt';
import session from './session';

import AccessModule from './AccessModule';

import { withUser } from '../containers/AuthBase';

import LOGOUT_FROM_ALL_DEVICES from './graphql/LogoutFromAllDevicesSub.graphql';

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

  componentDidMount() {
    if (!this.subscription) {
      this.subscribeToLogoutFromAllDevices();
    }
  }

  async componentDidUpdate() {
    if (!this.subscription) {
      this.subscribeToLogoutFromAllDevices();
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      // unsubscribe
      this.subscription();
      this.subscription = null;
    }
  }

  subscribeToLogoutFromAllDevices = async () => {
    const { subscribeToMore } = this.props;
    this.subscription = subscribeToMore({
      document: LOGOUT_FROM_ALL_DEVICES,
      updateQuery: async (
        prev,
        {
          subscriptionData: {
            data: {
              logoutFromAllDevicesSub: { userId: id }
            }
          }
        }
      ) => {
        const { currentUser, client } = this.props;
        if (currentUser && currentUser.id === id) {
          clearApolloStoreAndReloadComponent(client);
        }
      }
    });
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

export default new AccessModule(jwt, session, {
  dataRootComponent: [withUser(withApollo(AuthPageReloader))],
  login: [login],
  logout: [logout],
  logoutFromAllDevices: [logoutFromAllDevices]
});
