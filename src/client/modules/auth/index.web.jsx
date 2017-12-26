import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { NavLink } from 'react-router-dom';

import { MenuItem } from '../../modules/common/components/web';
import Register from './containers/Register';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';

import reducers from './reducers';

import { AuthLoggedInRoute, AuthLogin, AuthProfile } from './containers/Auth';

import Feature from '../connector';

import Account from './account';

const subfeatures = [Account];

function tokenMiddleware(req, options, next) {
  options.headers['x-token'] = window.localStorage.getItem('token');
  options.headers['x-refresh-token'] = window.localStorage.getItem('refreshToken');
  next();
}

function tokenAfterware(res, options, next) {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    window.localStorage.setItem('token', token);
  }
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken);
  }
  next();
}

function connectionParam() {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken')
  };
}

export default new Feature(
  {
    route: [
      <AuthLoggedInRoute exact path="/register" redirect="/account" component={Register} />,
      <AuthLoggedInRoute exact path="/login" redirect="/account" component={Login} />,
      <AuthLoggedInRoute exact path="/forgot-password" redirect="/account" component={ForgotPassword} />,
      <AuthLoggedInRoute exact path="/reset-password/:token" redirect="/account" component={ResetPassword} />
    ],
    navItemRight: [
      <MenuItem key="/account">
        <AuthProfile />
      </MenuItem>,
      <MenuItem key="/login">
        <AuthLogin>
          <NavLink to="/login" className="nav-link" activeClassName="active">
            Sign In
          </NavLink>
        </AuthLogin>
      </MenuItem>
    ],
    reducer: { user: reducers },
    middleware: tokenMiddleware,
    afterware: tokenAfterware,
    connectionParam: connectionParam,
    // eslint-disable-next-line react/display-name
    rootComponentFactory: req => <CookiesProvider cookies={req ? req.universalCookies : undefined} />
  },
  ...subfeatures
);
