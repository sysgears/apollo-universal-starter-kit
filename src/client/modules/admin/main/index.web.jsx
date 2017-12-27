import React from 'react';
import { CookiesProvider } from 'react-cookie';
import { AuthRoute } from '../../auth/containers/Auth';

import Feature from '../connector';

import Main from './containers/Main';

function connectionParam() {
  return {
    token: window.localStorage.getItem('token'),
    refreshToken: window.localStorage.getItem('refreshToken')
  };
}

export default new Feature({
  route: [<AuthRoute exact path="/admin" component={Main} />],
  connectionParam: connectionParam,
  // eslint-disable-next-line react/display-name
  rootComponentFactory: req => <CookiesProvider cookies={req ? req.universalCookies : undefined} />
});
