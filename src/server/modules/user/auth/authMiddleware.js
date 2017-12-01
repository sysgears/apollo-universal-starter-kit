import settings from '../../../../../settings';

import { tryLoginSerial } from './index';

export default (SECRET, User) => async (req, res, next) => {
  if (req.session.userId) {
    req.user = { id: req.session.userId };
  } else if (settings.user.auth.certificate.enabled) {
    // cert auth
    let serial = '';
    if (__DEV__) {
      // for local testing without client certificates
      serial = settings.user.auth.certificate.devSerial;
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
