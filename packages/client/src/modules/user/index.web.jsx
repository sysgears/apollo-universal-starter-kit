import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { NavLink, withRouter } from 'react-router-dom';

import auth from './auth';
import resolvers from './resolvers';
import ProfileView from './components/ProfileView';
import { MenuItem } from '../../modules/common/components/web';
import Users from './components/Users';
import UserEdit from './containers/UserEdit';
import Register from './containers/Register';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';

import { AuthRoute, IfLoggedIn, withUser, withLoadedUser, withLogout, IfNotLoggedIn } from './containers/Auth';

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

export * from './containers/Auth';

export default new Feature(auth, {
  route: [
    <AuthRoute exact path="/profile" role={['user', 'admin']} redirect="/login" component={withUser(ProfileView)} />,
    <AuthRoute exact path="/users" redirect="/login" role="admin" component={Users} />,
    <AuthRoute exact path="/users/:id" redirect="/login" role="admin" component={withRouter(UserEdit)} />,
    <AuthRoute exact path="/register" redirectOnLoggedIn redirect="/profile" component={Register} />,
    <AuthRoute
      exact
      path="/login"
      redirectOnLoggedIn
      redirect="/"
      component={withRouter(({ history }) => <Login onLogin={() => history.push('/profile')} />)}
    />,
    <AuthRoute exact path="/forgot-password" redirectOnLoggedIn redirect="/profile" component={ForgotPassword} />,
    <AuthRoute exact path="/reset-password/:token" redirectOnLoggedIn redirect="/profile" component={ResetPassword} />
  ],
  navItem: [
    <IfLoggedIn key="/users" role="admin">
      <MenuItem>
        <NavLink to="/users" className="nav-link" activeClassName="active">
          Users
        </NavLink>
      </MenuItem>
    </IfLoggedIn>
  ],
  navItemRight: [
    <IfLoggedIn key="/profile">
      <MenuItem>
        <NavLink to="/profile" className="nav-link" activeClassName="active">
          <ProfileName />
        </NavLink>
      </MenuItem>
    </IfLoggedIn>,
    <IfLoggedIn key="/logout">
      <MenuItem>
        <LogoutLink />
      </MenuItem>
    </IfLoggedIn>,
    <IfNotLoggedIn key="/login">
      <MenuItem>
        <NavLink to="/login" className="nav-link" activeClassName="active">
          Sign In
        </NavLink>
      </MenuItem>
    </IfNotLoggedIn>
  ],
  resolver: resolvers,
  // eslint-disable-next-line react/display-name
  rootComponentFactory: req => <CookiesProvider cookies={req ? req.universalCookies : undefined} />
});
