import React from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import { withApollo, graphql } from 'react-apollo';

import log from '../../../../../../common/log';

import CURRENT_USER_QUERY from '../../modules/jwt/graphql/CurrentUserQuery.graphql';
import LOGOUT from '../../modules/jwt/graphql/Logout.graphql';

const withUser = Component => {
  const WithUser = ({ ...props }) => <Component {...props} />;

  WithUser.propTypes = {
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool.isRequired
  };

  return graphql(CURRENT_USER_QUERY, {
    props({ data: { loading, currentUser, refetch } }) {
      return { currentUserLoading: loading, currentUser, refetchCurrentUser: refetch };
    }
  })(WithUser);
};

const withLoadedUser = Component => {
  const WithLoadedUser = ({ currentUserLoading, ...props }) => (currentUserLoading ? null : <Component {...props} />);

  WithLoadedUser.propTypes = {
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool.isRequired
  };

  return withUser(Component);
};

const IfLoggedInComponent = ({ currentUser, role, children, elseComponent }) =>
  currentUser && (!role || (Array.isArray(role) ? role : [role]).indexOf(currentUser.role) >= 0)
    ? children
    : elseComponent || null;
IfLoggedInComponent.propTypes = {
  currentUser: PropTypes.object,
  role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  elseComponent: PropTypes.node,
  children: PropTypes.node
};

const IfLoggedIn = withLoadedUser(IfLoggedInComponent);

const IfNotLoggedInComponent = ({ currentUser, children }) => (!currentUser ? children : null);
IfNotLoggedInComponent.propTypes = {
  currentUser: PropTypes.object,
  children: PropTypes.node
};

const IfNotLoggedIn = withLoadedUser(IfNotLoggedInComponent);

const withLogout = Component =>
  withApollo(
    graphql(LOGOUT, {
      props: ({ ownProps: { client }, mutate }) => ({
        logout: async onLogout => {
          try {
            const { data: { logout } } = await mutate();

            if (logout.errors) {
              return { errors: logout.errors };
            }
            await AsyncStorage.multiRemove(['token', 'session', 'refreshToken']);
            await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: null } });

            onLogout();
          } catch (e) {
            log.error(e);
          }
        }
      })
    })(Component)
  );

export { withUser };
export { withLoadedUser };
export { IfLoggedIn };
export { IfNotLoggedIn };
export { withLogout };
