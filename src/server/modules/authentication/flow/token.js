import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

import Authn from '../lib';
import Authz from '../../authorization/lib';

export const setTokenHeaders = (req, tokens) => {
  req.universalCookies.set('x-token', tokens.token, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  });
  req.universalCookies.set('x-refresh-token', tokens.refreshToken, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  });

  req.universalCookies.set('r-token', tokens.token, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false
  });
  req.universalCookies.set('r-refresh-token', tokens.refreshToken, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false
  });
};

export const setResponseTokenHeaders = (res, tokens) => {
  res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
  res.set('x-token', tokens.token);
  res.set('x-refresh-token', tokens.token);
  res.set('r-token', tokens.token);
  res.set('r-refresh-token', tokens.token);
  res.cookie('x-token', tokens.token, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  });
  res.cookie('x-refresh-token', tokens.refreshToken, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  });

  res.cookie('r-token', tokens.token, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false
  });
  res.cookie('r-refresh-token', tokens.refreshToken, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: false
  });
};

export const removeTokenHeaders = req => {
  req.universalCookies.remove('x-token');
  req.universalCookies.remove('x-refresh-token');

  req.universalCookies.remove('r-token');
  req.universalCookies.remove('r-refresh-token');
};

export const createToken = async (user, secret, refreshSecret) => {
  let tokenUser = pick(user, ['id', 'email', 'displayName']);

  let roles = await Authz.getAllRolesForUser(tokenUser.id);
  tokenUser.roles = roles;

  const createToken = jwt.sign(
    {
      user: tokenUser
    },
    secret,
    {
      expiresIn: '1m'
    }
  );

  const createRefreshToken = jwt.sign(
    {
      user: user.id
    },
    refreshSecret,
    {
      expiresIn: '30d'
    }
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshToken = async (token, refreshToken, SECRET) => {
  let id = -1;
  try {
    const { user } = jwt.decode(refreshToken);
    id = user;
  } catch (err) {
    return {};
  }

  const userPass = await Authn.getUserWithPassword(id);
  if (!userPass) {
    return {};
  }
  const refreshSecret = SECRET + userPass.password;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createToken(userPass, SECRET, refreshSecret);
  const { user } = jwt.decode(newToken);

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user: pick(user, ['id', 'email', 'displayName', 'roles'])
  };
};
