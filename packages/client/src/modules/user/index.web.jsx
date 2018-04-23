import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { NavLink, withRouter } from 'react-router-dom';

import translate from '../../i18n';
import access from './access';
import resolvers from './resolvers';
import resources from './locales';
import ProfileView from './components/ProfileView';
import { MenuItem } from '../../modules/common/components/web';
import Users from './components/Users';
import UserEdit from './containers/UserEdit';
import Register from './containers/Register';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';

import { AuthRoute, IfLoggedIn, withLoadedUser, withLogout, IfNotLoggedIn } from './containers/Auth';

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

const MenuItemUsersWithI18n = translate('user')(({ t }) => (
  <IfLoggedIn key="/users" role="admin">
    <MenuItem>
      <NavLink to="/users" className="nav-link" activeClassName="active">
        {t('navLink.users')}
      </NavLink>
    </MenuItem>
  </IfLoggedIn>
));
const MenuItemLoginWithI18n = translate('user')(({ t }) => (
  <IfNotLoggedIn key="/login">
    <MenuItem>
      <NavLink to="/login" className="nav-link" activeClassName="active">
        {t('navLink.sign')}
      </NavLink>
    </MenuItem>
  </IfNotLoggedIn>
));

export default new Feature(access, {
  route: [
    <AuthRoute exact path="/profile" role={['user', 'admin']} redirect="/login" component={ProfileView} />,
    <AuthRoute exact path="/users" redirect="/login" role="admin" component={Users} />,
    <AuthRoute exact path="/users/:id" redirect="/login" role="admin" component={UserEdit} />,
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
  navItem: [<MenuItemUsersWithI18n />],
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
    <MenuItemLoginWithI18n />
  ],
  resolver: resolvers,
  localization: { ns: 'user', resources },
  // eslint-disable-next-line react/display-name
  rootComponentFactory: req => <CookiesProvider cookies={req ? req.universalCookies : undefined} />
});
