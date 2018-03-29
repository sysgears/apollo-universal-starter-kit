import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, graphql, compose } from 'react-apollo';
import { Route, Redirect, NavLink, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import decode from 'jwt-decode';

import log from '../../../../../common/log';
import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGOUT from '../graphql/Logout.graphql';

const checkAuth = (cookies, scope) => {
  //console.log('checkAuth, scope:', scope);
  let token = null;
  let refreshToken = null;

  if (cookies && cookies.get('r-token')) {
    token = cookies.get('r-token');
    refreshToken = cookies.get('r-refresh-token');
  }
  if (__CLIENT__ && window.localStorage.getItem('token')) {
    token = window.localStorage.getItem('token');
    refreshToken = window.localStorage.getItem('refreshToken');
  }

  if (!token || !refreshToken) {
    return false;
  }

  try {
    const { exp } = decode(refreshToken);

    if (exp < new Date().getTime() / 1000) {
      return false;
    }

    /*
    ? children
    : elseComponent || null;*/

    //if (scope === 'admin') {
    const { user: { role } } = decode(token);
    //if (scope !== role) {
    return role && (!scope || (Array.isArray(scope) ? scope : [scope]).indexOf(role) >= 0);
    //}
    //}
  } catch (e) {
    return false;
  }
};

const profileName = cookies => {
  let token = null;

  if (cookies && cookies.get('x-token')) {
    token = cookies.get('x-token');
  }

  if (__CLIENT__ && window.localStorage.getItem('token')) {
    token = window.localStorage.getItem('token');
  }

  if (!token) {
    return '';
  }

  try {
    const { user: { username, fullName } } = decode(token);
    return fullName ? fullName : username;
  } catch (e) {
    return '';
  }
};
/*
class IfLoggedIn extends React.Component {
  static propTypes = {
    children: PropTypes.object
  };
  render() {
    const { children, ...restProps } = this.props;
    return React.cloneElement(children, {
      ...restProps
    });
  }
}
*/
const IfLoggedIn = withCookies(({ children, cookies, role, ...restProps }) => {
  return checkAuth(cookies, role)
    ? React.cloneElement(children, {
        ...restProps
      })
    : null;
});

IfLoggedIn.propTypes = {
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLogin = ({ children, cookies, logout }) => {
  return checkAuth(cookies) ? (
    <a href="#" onClick={() => logout()} className="nav-link">
      Logout
    </a>
  ) : (
    children
  );
};

AuthLogin.propTypes = {
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies),
  logout: PropTypes.func.isRequired
};

const AuthLoginWithApollo = withCookies(
  withRouter(
    withApollo(
      compose(
        graphql(CURRENT_USER_QUERY),
        graphql(LOGOUT, {
          // eslint-disable-next-line
          props: ({ ownProps: { client, history, navigation }, mutate }) => ({
            logout: async () => {
              try {
                const { data: { logout } } = await mutate();

                if (logout.errors) {
                  return { errors: logout.errors };
                }

                // comment out until https://github.com/apollographql/apollo-client/issues/1186 is fixed
                //await client.resetStore();

                window.localStorage.setItem('token', null);
                window.localStorage.setItem('refreshToken', null);

                if (history) {
                  return history.push('/login');
                }
                if (navigation) {
                  return navigation.goBack();
                }
              } catch (e) {
                log.error(e.stack);
              }
            }
          })
        })
      )(AuthLogin)
    )
  )
);

const AuthProfile = withCookies(({ cookies }) => {
  return checkAuth(cookies) ? (
    <NavLink to="/profile" className="nav-link" activeClassName="active">
      {profileName(cookies)}
    </NavLink>
  ) : null;
});

AuthProfile.propTypes = {
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLoggedIn = withCookies(({ cookies, label, to, ...rest }) => {
  return checkAuth(cookies) ? (
    <NavLink to={to} {...rest}>
      {label}
    </NavLink>
  ) : null;
});

AuthLoggedIn.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies),
  label: PropTypes.string,
  to: PropTypes.string
};

const AuthRoute = withCookies(({ component: Component, cookies, role, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        checkAuth(cookies, role) ? <Component {...props} {...rest} /> : <Redirect to={{ pathname: '/login' }} />
      }
    />
  );
});

AuthRoute.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLoggedInRoute = withCookies(({ component: Component, cookies, redirect, role, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => (checkAuth(cookies, role) ? <Redirect to={{ pathname: redirect }} /> : <Component {...props} />)}
    />
  );
});

AuthLoggedInRoute.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies),
  redirect: PropTypes.string,
  role: PropTypes.string
};

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

export { withUser };
export { hasRole };
export { IfLoggedIn };
export { AuthLoggedIn };
export { AuthLoginWithApollo as AuthLogin };
export { AuthProfile };
export { AuthRoute };
export { AuthLoggedInRoute };
