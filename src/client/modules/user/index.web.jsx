import React from 'react';
import PropTypes from 'prop-types';
import { CookiesProvider } from 'react-cookie';
import { Route, NavLink, Redirect, withRouter } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import ProfileView from './components/ProfileView';
import Users from './components/Users';
import UserEdit from './containers/UserEdit';
import Register from './containers/Register';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';
import reducers from './reducers';

import { withUser, withLoadedUser, withLogout, IfLoggedIn, IfNotLoggedIn } from './containers/Auth';

import Feature from '../connector';

const ProfileName = withLoadedUser(
  ({ currentUser }) => (currentUser ? currentUser.fullName || currentUser.username : null)
);

const LogoutLink = withRouter(
  withLogout(({ logout, history }) => (
    <a href="#" onClick={() => logout(() => history.push('/'))} className="nav-link">
      Logout
    </a>
  ))
);

const AuthRoute = ({ role, redirect, redirectOnLoggedIn, ...props }) =>
  redirectOnLoggedIn ? (
    <IfNotLoggedIn role={role} elseComponent={<Redirect to={{ pathname: redirect }} />}>
      <Route {...props} />
    </IfNotLoggedIn>
  ) : (
    <IfLoggedIn role={role} elseComponent={<Redirect to={{ pathname: redirect }} />}>
      <Route {...props} />
    </IfLoggedIn>
  );

AuthRoute.propTypes = {
  role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  redirect: PropTypes.string.isRequired,
  redirectOnLoggedIn: PropTypes.bool
};

export default new Feature({
  route: [
    <AuthRoute exact path="/profile" role={['user', 'admin']} redirect="/login" component={withUser(ProfileView)} />,
    <AuthRoute exact path="/users" redirect="/login" role="admin" component={Users} />,
    <Route exact path="/users/:id" component={UserEdit} />,
    <AuthRoute exact path="/register" redirectOnLoggedIn redirect="/profile" component={Register} />,
    <AuthRoute
      exact
      path="/login"
      redirectOnLoggedIn
      redirect="/profile"
      component={withRouter(({ history }) => <Login onLogin={() => history.push('/profile')} />)}
    />,
    <AuthRoute exact path="/forgot-password" redirectOnLoggedIn redirect="/profile" component={ForgotPassword} />,
    <AuthRoute exact path="/reset-password/:token" redirectOnLoggedIn redirect="/profile" component={ResetPassword} />
  ],
  navItem: [
    <MenuItem key="/users">
      <IfLoggedIn role="admin">
        <NavLink to="/users" className="nav-link" activeClassName="active">
          Users
        </NavLink>
      </IfLoggedIn>
    </MenuItem>
  ],
  navItemRight: [
    <IfLoggedIn>
      <MenuItem key="/profile">
        <NavLink to="/profile" className="nav-link" activeClassName="active">
          <ProfileName />
        </NavLink>
      </MenuItem>
      <LogoutLink />
    </IfLoggedIn>,
    <IfNotLoggedIn>
      <span className="nav-link">
        <NavLink to="/login" activeClassName="active">
          Sign In
        </NavLink>
      </span>
    </IfNotLoggedIn>
  ],
  reducer: { user: reducers },
  middleware: (req, options, next) => {
    if (__CLIENT__) {
      options.headers = { 'X-Token': window.__CSRF_TOKEN__ };
    }
    next();
  },
  // eslint-disable-next-line react/display-name
  rootComponentFactory: req => <CookiesProvider cookies={req ? req.universalCookies : undefined} />
});
