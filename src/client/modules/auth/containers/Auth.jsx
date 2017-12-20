import React from 'react';
import PropTypes from 'prop-types';
import { withApollo, graphql, compose } from 'react-apollo';
import { Route, Redirect, NavLink, withRouter } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';
import decode from 'jwt-decode';

import log from '../../../../common/log';
import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
import LOGOUT from '../graphql/Logout.graphql';

import { checkAuth } from '../../../../common/authValidation';

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
    const { user: { email } } = decode(token);
    return email;
  } catch (e) {
    return '';
  }
};

const AuthNav = withCookies(({ children, cookies, scopes }) => {
  // TODO add context and params here?
  return checkAuth(cookies, scopes) ? children : null;
});

AuthNav.propTypes = {
  children: PropTypes.object,
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLogin = ({ children, cookies, logout }) => {
  let can = checkAuth(cookies);
  return can ? (
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

                window.localStorage.removeItem('token');
                window.localStorage.removeItem('refreshToken');

                if (history) {
                  return history.push('/');
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
      {label}?
    </NavLink>
  ) : null;
});

AuthLoggedIn.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies),
  label: PropTypes.string,
  to: PropTypes.string
};

const AuthRoute = withCookies(({ component: Component, cookies, scopes, context, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        console.log('PROPS', props);
        let params = {};
        if (props.match) {
          params = props.match.params;
        } else if (props.navigation) {
          params = props.navigation.state.params;
        }
        return checkAuth(cookies, scopes, context, params) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login' }} />
        );
      }}
    />
  );
});

AuthRoute.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies)
};

const AuthLoggedInRoute = withCookies(({ component: Component, cookies, redirect, scopes, context, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        // console.log("PROPS", props)
        let params = {};
        if (props.match) {
          params = props.match.params;
        } else if (props.navigation) {
          params = props.navigation.state.params;
        }
        return checkAuth(cookies, scopes, context, params) ? (
          <Redirect to={{ pathname: redirect }} />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
});

AuthLoggedInRoute.propTypes = {
  component: PropTypes.func,
  cookies: PropTypes.instanceOf(Cookies),
  redirect: PropTypes.string,
  scope: PropTypes.string
};

export { AuthNav };
export { AuthLoggedIn };
export { AuthLoginWithApollo as AuthLogin };
export { AuthProfile };
export { AuthRoute };
export { AuthLoggedInRoute };
