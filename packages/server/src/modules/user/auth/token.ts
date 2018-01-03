import settings from '../../../../settings';

import { refreshTokens, tryLoginSerial } from './index';

export default (SECRET: any, User: any, jwt: any) => async (req: any, res: any, next: any) => {
  let token = (req.universalCookies ? req.universalCookies.get('x-token') : null) || req.headers['x-token'];

  // if cookie available
  if (req.universalCookies && req.universalCookies.get('x-token')) {
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
      const refreshToken: any =
        (req.universalCookies ? req.universalCookies.get('x-refresh-token') : null) || req.headers['x-refresh-token'];
      const newTokens: any = await refreshTokens(token, refreshToken, User, SECRET);

      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);

        if (req.universalCookies) {
          setTokenToCookies(req.universalCookies, newTokens.token, newTokens.refreshToken);
        }
      }
      req.user = newTokens.user;
    }
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
    const result: any = await tryLoginSerial(serial, User, SECRET);

    if (req.universalCookies) {
      setTokenToCookies(req.universalCookies, result.token, result.refreshToken);
    }
  }

  next();
};

const setTokenToCookies = (universalCookies: any, token: string, refreshToken: string) => {
  const maxAgeObj = {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true
  };

  universalCookies.set('x-token', token, maxAgeObj);
  universalCookies.set('x-refresh-token', refreshToken, maxAgeObj);

  universalCookies.set('r-token', token, maxAgeObj);
  universalCookies.set('r-refresh-token', refreshToken, maxAgeObj);
};
