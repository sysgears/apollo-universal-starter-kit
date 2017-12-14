import jwt from 'jsonwebtoken';
import { pick } from 'lodash';

// export const setTokenHeaders = (res, req, tokens) => {
export const setTokenHeaders = (req, tokens) => {
  req.universalCookies.set('x-token', tokens.token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true
  });
  req.universalCookies.set('x-refresh-token', tokens.refreshToken, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true
  });

  req.universalCookies.set('r-token', tokens.token, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: false
  });
  req.universalCookies.set('r-refresh-token', tokens.refreshToken, {
    maxAge: 60 * 60 * 24 * 7,
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
  let tokenUser = pick(user, ['id', 'email', 'role']);

  const createToken = jwt.sign(
    {
      user: tokenUser
    },
    secret,
    {
      expiresIn: '30m'
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

export const refreshToken = async (token, refreshToken, User, SECRET) => {
  let id = -1;
  try {
    const { user } = jwt.decode(refreshToken);
    id = user;
  } catch (err) {
    return {};
  }

  const user = await User.getUserWithPassword(id);
  if (!user) {
    return {};
  }
  const refreshSecret = SECRET + user.password;

  try {
    jwt.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createToken(user, SECRET, refreshSecret);

  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user: pick(user, ['id', 'email', 'role'])
  };
};
