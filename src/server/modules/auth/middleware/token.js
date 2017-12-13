import jwt from 'jsonwebtoken';
import settings from '../../../../../settings';

import { setTokenHeaders, refreshToken, tryLoginSerial } from '../flow';

const SECRET = settings.auth.secret;

export default User => async (req, res, next) => {
  let token = req.universalCookies.get('x-token') || req.headers['x-token'];
  console.log('TOKEN!!!', token);

  // if cookie available
  if (req.universalCookies.get('x-token')) {
    // check if header token matches cookie token
    if (
      req.universalCookies.get('x-token') !== req.universalCookies.get('r-token') ||
      req.universalCookies.get('x-refresh-token') !== req.universalCookies.get('r-refresh-token')
    ) {
      // if x-token is not empty and not the same as cookie x-token revoke authentication
      token = undefined;
    }
  }
  //console.log(token);
  if (token && token !== 'null') {
    console.log('Do Token');
    try {
      const { user } = jwt.verify(token, SECRET);
      console.log('user:', user);
      req.user = user;
    } catch (err) {
      console.log('Catch!');
      const currRefreshToken = req.universalCookies.get('x-refresh-token') || req.headers['x-refresh-token'];
      const newToken = await refreshToken(token, currRefreshToken, User, SECRET);

      console.log('new Token', newToken);

      if (newToken.token && newToken.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newToken.token);
        res.set('x-refresh-token', newToken.refreshToken);

        setTokenHeaders(req, newToken);
      }
      req.user = newToken.user;
    }
  } else if (settings.auth.authentication.certificate.enabled) {
    console.log('Try serial');
    // cert auth
    let serial = '';
    if (__DEV__) {
      // for local testing without client certificates
      serial = settings.auth.authentication.certificate.devSerial;
    }
    // if header available
    if (req.headers['x-serial']) {
      serial = req.headers['x-serial'];
    }
    const newToken = await tryLoginSerial(serial, User, SECRET);

    setTokenHeaders(req, newToken);
  }

  next();
};
