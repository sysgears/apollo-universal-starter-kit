import settings from '../../../../../settings';

import { createToken } from './token';

const SECRET = settings.auth.secret;

export const tryLogin = async () => {
  return { message: 'depreciated perminently' };
};

export const tryLoginSerial = async (serial, Auth) => {
  try {
    const certAuth = await Auth.getUserFromSerial(serial);

    const user = await Auth.getUserWithPassword(certAuth.uuid);

    const refreshSecret = SECRET + user.password;
    const [token, refreshToken] = await createToken(user, SECRET, refreshSecret);

    return {
      user,
      token,
      refreshToken
    };
  } catch (err) {
    return {};
  }
};
