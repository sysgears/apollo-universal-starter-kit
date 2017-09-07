import jwt from 'jsonwebtoken';

import { refreshTokens } from './auth';

export default (SECRET, User) => (async (req, res, next) => {
  let token = req.headers['x-token'] || req.universalCookies.get('x-token');

  // check if cookie was changed client side
  if ((req.universalCookies.get('x-token') !== req.universalCookies.get('r-token')) || (req.universalCookies.get('x-refresh-token') !== req.universalCookies.get('r-refresh-token')))
  {
    // if cookie was cleared do to logout clear tokens
    if (req.universalCookies.get('x-token') === undefined) {
      req.universalCookies.remove('x-token');
      req.universalCookies.remove('r-token');
      req.universalCookies.remove('x-refresh-token');
      req.universalCookies.remove('r-refresh-token');
    }

    // if x-token is not empty and not the same as r-token revoke authentication
    token = undefined;
  }

  //console.log(token);
  if (token && token !== 'null') {
    if (req.headers['x-token']) {
      req.universalCookies.set('x-token', req.headers['x-token'], {maxAge : 60, httpOnly: false});
      req.universalCookies.set('r-token', req.headers['x-token'], {maxAge : 60, httpOnly: true});
      req.universalCookies.set('x-refresh-token', req.headers['x-refresh-token'], {maxAge : 60 * 60 * 24 * 7, httpOnly: false});
      req.universalCookies.set('r-refresh-token', req.headers['x-refresh-token'], {maxAge : 60 * 60 * 24 * 7, httpOnly: true});
    }
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'] || req.universalCookies.get('x-refresh-token');
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

        req.universalCookies.set('x-token', newTokens.token, {maxAge : 60, httpOnly: false});
        req.universalCookies.set('r-token', newTokens.token, {maxAge : 60, httpOnly: true});
        req.universalCookies.set('x-refresh-token', newTokens.refreshToken, {maxAge : 60 * 60 * 24 * 7, httpOnly: false});
        req.universalCookies.set('r-refresh-token', newTokens.refreshToken, {maxAge : 60 * 60 * 24 * 7, httpOnly: true});
      }
      req.user = newTokens.user;
    }
  }

  next();
});
