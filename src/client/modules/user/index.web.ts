import * as reducers from './reducers';

import Feature from '../connector';
import LoginView from './components/LoginView.web';
import ProfileView from './components/ProfileView.web';

const tokenMiddleware = (req: any, options: any) => {
  options.headers['x-token'] = window.localStorage.getItem('token');
  options.headers['x-refresh-token'] = window.localStorage.getItem('refreshToken');
};

const tokenAfterware = (res: any, options: any) => {
  const token = options.headers['x-token'];
  const refreshToken = options.headers['x-refresh-token'];
  if (token) {
    window.localStorage.setItem('token', token);
  }
  if (refreshToken) {
    window.localStorage.setItem('refreshToken', refreshToken);
  }
};

const connectionParam = () => {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken')
  };
};

export default new Feature({
  route: [{ path: 'login', component: LoginView }, { path: 'profile', component: ProfileView }],
  navItem: [`<auth-nav [role]="'admin'"></auth-nav>`],
  navItemRight: [`<auth-login></auth-login>`],
  reducer: { user: reducers },
  middleware: tokenMiddleware,
  afterware: tokenAfterware,
  connectionParam
});

// // React
// import React from 'react';
// import { Route, NavLink } from 'react-router-dom';
// import { NavItem } from 'reactstrap';
//
// // Component and helpers
// import Profile from './containers/Profile';
// import Users from './containers/Users';
// import Register from './containers/Register';
// import Login from './containers/Login';
// import reducers from './reducers';
//
// import { AuthRoute, AuthLogin, AuthLogin, AuthProfile } from './containers/Auth';
//
// import Feature from '../connector';
//
// function tokenMiddleware(req, options) {
//   options.headers['x-token'] = window.localStorage.getItem('token');
//   options.headers['x-refresh-token'] = window.localStorage.getItem('refreshToken');
// }
//
// function tokenAfterware(res, options) {
//   const token = options.headers['x-token'];
//   const refreshToken = options.headers['x-refresh-token'];
//   if (token) {
//     window.localStorage.setItem('token', token);
//   }
//   if (refreshToken) {
//     window.localStorage.setItem('refreshToken', refreshToken);
//   }
// }
//
// function connectionParam() {
//   return {
//     token: window.localStorage.getItem('token'),
//     refreshToken: window.localStorage.getItem('refreshToken')
//   };
// }
//
// export default new Feature({
//   route: [
//     <AuthRoute exact path="/profile" role="user" component={Profile} />,
//     <AuthRoute exact path="/users" role="admin" component={Users} />,
//     <Route exact path="/register" component={Register} />,
//     <Route exact path="/login" component={Login} />
//   ],
//   navItem: [
//     <NavItem>
//       <AuthLogin role="admin">
//         <NavLink to="/users" className="nav-link" activeClassName="active">
//           Users
//         </NavLink>
//       </AuthLogin>
//     </NavItem>
//   ],
//   navItemRight: [
//     <NavItem>
//       <AuthProfile />
//     </NavItem>,
//     <NavItem>
//       <AuthLogin>
//         <span className="nav-link">
//           <NavLink to="/login" activeClassName="active">
//             Login
//           </NavLink>{' '}
//           /{' '}
//           <NavLink to="/register" activeClassName="active">
//             Register
//           </NavLink>
//         </span>
//       </AuthLogin>
//     </NavItem>
//   ],
//   reducer: { user: reducers },
//   middleware: tokenMiddleware,
//   afterware: tokenAfterware,
//   connectionParam: connectionParam
// });
