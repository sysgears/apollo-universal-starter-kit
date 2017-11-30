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

const AuthRoute = ({ role, ...props }) => (
  <IfLoggedIn role={role} elseComponent={<Redirect to={{ pathname: '/login' }} />}>
    <Route {...props} />
  </IfLoggedIn>
);

AuthRoute.propTypes = {
  role: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
};

export default new Feature({
  route: [
    <AuthRoute exact path="/profile" role={['user', 'admin']} component={withUser(ProfileView)} />,
    <AuthRoute exact path="/users" role="admin" component={Users} />,
    <Route exact path="/users/:id" component={UserEdit} />,
    <Route exact path="/register" component={Register} />,
    <Route exact path="/login" component={Login} />,
    <Route exact path="/forgot-password" component={ForgotPassword} />,
    <Route exact path="/reset-password/:token" component={ResetPassword} />
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
  // eslint-disable-next-line react/display-name
  rootComponentFactory: req => <CookiesProvider cookies={req ? req.universalCookies : undefined} />
});
