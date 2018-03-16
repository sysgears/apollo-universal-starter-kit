import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, graphql, compose } from 'react-apollo';

import log from '../../../../../common/log';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGOUT from '../auth/jwt/graphql/Logout.graphql';
import USER_ACTION_QUERY from '../graphql/UserActions.client.graphql';
import CHANGE_ACTION from '../graphql/ChangeUserAction.client.graphql';

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

const withCheckAction = Component => {
  return compose(
    withApollo,
    graphql(CHANGE_ACTION, {
      props: ({ mutate }) => ({
        changeAction: async action => {
          await mutate({ variables: { action: action } });
        }
      })
    }),
    graphql(USER_ACTION_QUERY, {
      props: ({ data: { action } }) => ({ action })
    })
  )(Component);
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
  children: PropTypes.node,
  elseComponent: PropTypes.node
};

const IfLoggedIn = withLoadedUser(IfLoggedInComponent);

const IfNotLoggedInComponent = ({ currentUser, children, elseComponent }) =>
  !currentUser ? children : elseComponent || null;

IfNotLoggedInComponent.propTypes = {
  currentUser: PropTypes.object,
  children: PropTypes.node,
  elseComponent: PropTypes.node
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
            await client.writeQuery({ query: CURRENT_USER_QUERY, data: { currentUser: null } });
            ['token', 'refreshToken'].forEach(item => window.localStorage.removeItem(item));
            onLogout();
          } catch (e) {
            log.error(e);
          }
        }
      })
    })(Component)
  );

export { withUser, withCheckAction, withLoadedUser, IfLoggedIn, IfNotLoggedIn, withLogout };
