import jwt from 'jsonwebtoken';

import { refreshTokens } from './auth';

export default (SECRET, User) => (async (req, res, next) => {
  let token = req.universalCookies.get('x-token') || req.headers['x-token'];

  // if header available
  if (req.headers['x-token']) {
    // check if header token matches cookie token
    if (req.universalCookies.get('x-token') !== req.headers['x-token'])
    {
      // if x-token is not empty and not the same as cookie x-token revoke authentication
      token = undefined;
    }
  }
  if (token && token !== 'null') {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.universalCookies.get('x-refresh-token') || req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        User,
        SECRET,
      );

      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Allow-Origin', 'true');
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);

        req.universalCookies.set('x-token', newTokens.token, {maxAge : 60 * 60 * 24 * 7, httpOnly: true});
        req.universalCookies.set('x-refresh-token', newTokens.refreshToken, {maxAge : 60 * 60 * 24 * 7, httpOnly: true});
      }
      req.user = newTokens.user;
    }
  }

  next();
});
