import React from 'react';
import { CookiesProvider } from 'react-cookie';

import Feature from '../../connector';
import { AuthRoute } from '../containers/Auth';

import reducers from './reducers/personal';

import Profile from './containers/Profile';

function connectionParam() {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken')
  };
}

export default new Feature({
  route: [
    // <AuthRoute exact path="/account" scopes={[]} component={Account} />,
    <AuthRoute exact path="/profile" scopes={[]} component={Profile} />
    // <AuthRoute exact path="/profile" scopes={['user/self/view']} component={Profile} />,
    //<AuthRoute exact path="/profile/edit" scopes={['user:update:self']}component={ProfileEdit} />,
  ],
  reducer: { profile: reducers },
  connectionParam: connectionParam,
  // eslint-disable-next-line react/display-name
  rootComponentFactory: req => <CookiesProvider cookies={req ? req.universalCookies : undefined} />
});
