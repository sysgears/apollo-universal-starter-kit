import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import Profile from './containers/Profile';
import Users from './components/Users';
import UserEdit from './containers/UserEdit';
import Register from './containers/Register';
import Login from './containers/Login';
import ForgotPassword from './containers/ForgotPassword';
import ResetPassword from './containers/ResetPassword';
import reducers from './reducers';

import { AuthRoute, AuthNav, AuthLogin, AuthProfile } from './containers/Auth';
import { tokenMiddleware, tokenAfterware, connectionParam } from './helpers/middleware';

import Feature from '../connector';

export default new Feature({
  route: [
    <AuthRoute exact path="/profile" scope="user" component={Profile} />,
    <AuthRoute exact path="/users" scope="admin" component={Users} />,
    <Route exact path="/users/:id" component={UserEdit} />,
    <Route exact path="/register" component={Register} />,
    <Route exact path="/login" component={Login} />,
    <Route exact path="/forgot-password" component={ForgotPassword} />,
    <Route exact path="/reset-password/:token" component={ResetPassword} />
  ],
  navItem: [
    <MenuItem key="/users">
      <AuthNav scope="admin">
        <NavLink to="/users" className="nav-link" activeClassName="active">
          Users
        </NavLink>
      </AuthNav>
    </MenuItem>
  ],
  navItemRight: [
    <MenuItem key="/profile">
      <AuthProfile />
    </MenuItem>,
    <MenuItem key="login">
      <AuthLogin>
        <span className="nav-link">
          <NavLink to="/login" activeClassName="active">
            Sign In
          </NavLink>
        </span>
      </AuthLogin>
    </MenuItem>
  ],
  reducer: { user: reducers },
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam: connectionParam
});
