import jwt from 'jsonwebtoken';
import settings from '../../../../../settings';

import { setTokenHeaders, setResponseTokenHeaders, refreshToken } from '../flow/token';
import { tryLoginSerial } from '../flow/serial';

const SECRET = settings.auth.secret;

export default User => async (req, res, next) => {
  let token = req.universalCookies.get('x-token') || req.headers['x-token'];

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
  if (token && token !== 'null') {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const currRefreshToken = req.universalCookies.get('x-refresh-token') || req.headers['x-refresh-token'];
      const newToken = await refreshToken(token, currRefreshToken, SECRET);

      if (newToken.token && newToken.refreshToken) {
        setResponseTokenHeaders(res, newToken);
        setTokenHeaders(req, newToken);
      }
      req.user = newToken.user;
    }

    // Should add ApiKey here as well
  } else if (settings.auth.authentication.certificate.enabled) {
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

    if (newToken.token && newToken.refreshToken) {
      setResponseTokenHeaders(res, newToken);
      setTokenHeaders(req, newToken);
    }
    req.user = newToken.user;
  }

  // console.log('Token Middleware - tokenUser', req.user);
  next();
};
