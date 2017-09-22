import jwt from 'jsonwebtoken';
import settings from '../../../../settings';

import { refreshTokens, tryLoginSerial } from './auth';

export default (SECRET, User) => async (req, res, next) => {
  let token = req.universalCookies.get('x-token') || req.headers['x-token'];

  // if header available
  if (req.headers['x-token']) {
    // check if header token matches cookie token
    if (
      req.headers['x-token'] !== req.universalCookies.get('x-token') ||
      req.headers['x-refresh-token'] !== req.universalCookies.get('x-refresh-token')
    ) {
      // if x-token is not empty and not the same as cookie x-token revoke authentication
      token = undefined;
    }
  }

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
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.universalCookies.get('x-refresh-token') || req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, User, SECRET);

      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);

        req.universalCookies.set('x-token', newTokens.token, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true
        });
        req.universalCookies.set('x-refresh-token', newTokens.refreshToken, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true
        });

        req.universalCookies.set('r-token', newTokens.token, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false
        });
        req.universalCookies.set('r-refresh-token', newTokens.refreshToken, {
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: false
        });
      }
      req.user = newTokens.user;
    }
  } else if (settings.user.certAuth) {
    // cert auth
    let serial = '';
    if (__DEV__) {
      // for local testing without client certificates
      serial = '00';
    }
    // if header available
    if (req.headers['x-serial']) {
      serial = req.headers['x-serial'];
    }
    const result = await tryLoginSerial(serial, User, SECRET);

    req.universalCookies.set('x-token', result.token, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true
    });
    req.universalCookies.set('x-refresh-token', result.refreshToken, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true
    });

    req.universalCookies.set('r-token', result.token, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false
    });
    req.universalCookies.set('r-refresh-token', result.refreshToken, {
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false
    });
  }

  next();
};
