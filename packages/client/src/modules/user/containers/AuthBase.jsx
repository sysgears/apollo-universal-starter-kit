import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, graphql } from 'react-apollo';

import access from '../access';

import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

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

const hasRole = (role, currentUser) => {
  return currentUser && (!role || (Array.isArray(role) ? role : [role]).indexOf(currentUser.role) >= 0) ? true : false;
};

const withLoadedUser = Component => {
  const WithLoadedUser = ({ currentUserLoading, ...props }) => (currentUserLoading ? null : <Component {...props} />);

  WithLoadedUser.propTypes = {
    currentUser: PropTypes.object,
    currentUserLoading: PropTypes.bool.isRequired
  };

  return withUser(WithLoadedUser);
};

const IfLoggedInComponent = ({ currentUser, role, children, elseComponent, refetchCurrentUser, ...restProps }) =>
  hasRole(role, currentUser)
    ? React.cloneElement(children, {
        ...restProps
      })
    : elseComponent || null;
IfLoggedInComponent.propTypes = {
  currentUser: PropTypes.object,
  role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  elseComponent: PropTypes.node,
  children: PropTypes.node
};

const IfLoggedIn = withLoadedUser(IfLoggedInComponent);

const IfNotLoggedInComponent = ({ currentUser, children, refetchCurrentUser, ...restProps }) =>
  !currentUser
    ? React.cloneElement(children, {
        ...restProps
      })
    : null;
IfNotLoggedInComponent.propTypes = {
  currentUser: PropTypes.object,
  children: PropTypes.node
};

const IfNotLoggedIn = withLoadedUser(IfNotLoggedInComponent);

const withLogout = Component =>
  withApollo(({ client, ...props }) => {
    const newProps = { ...props, logout: () => access.doLogout(client) };
    return <Component {...newProps} />;
  });

export { withUser, hasRole, withLoadedUser, IfLoggedIn, IfNotLoggedIn, withLogout };
