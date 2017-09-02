import jwt from 'jsonwebtoken';

import modules from '../modules';
import { refreshTokens } from '../api/auth';

export default (SECRET) => (async (req, res, next) => {
  const token = req.headers['x-token'] || req.cookies['x-token'];

  console.log(token);
  if (token) {
    if (req.headers['x-token']) {
      res.cookie('x-token', req.headers['x-token'], {maxAge : 1000*60*20, httpOnly: false});
      res.cookie('x-refresh-token', req.headers['x-refresh-token'], {maxAge : 1000*60*60*24*7, httpOnly: false});
    }
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'] || req.cookies['x-refresh-token'];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        ...modules.createContext().User,
        SECRET,
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Allow-Origin', 'true');
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);

        res.cookie('x-token', newTokens.token, {maxAge : 1000*60*20, httpOnly: false});
        res.cookie('x-refresh-token', newTokens.refreshToken, {maxAge : 1000*60*60*24*7, httpOnly: false});
      }
      req.user = newTokens.user;
    }
  }

  next();
});
