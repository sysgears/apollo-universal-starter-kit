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
  console.log('CREATE TOKEN', user);
  let tokenUser = pick(user, ['userId', 'email', 'role']);

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
      user: user.userId
    },
    refreshSecret,
    {
      expiresIn: '30d'
    }
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshToken = async (token, refreshToken, User, SECRET) => {
  console.log('Token - Refresh');
  let userId = -1;
  try {
    const { user } = jwt.decode(refreshToken);
    console.log(' - decode user', user);
    userId = user;
  } catch (err) {
    return {};
  }

  console.log('userId', userId);
  const user = await User.getUserWithPassword(userId);
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
    user: pick(user, ['id', 'username', 'role'])
  };
};
