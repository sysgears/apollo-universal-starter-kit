import bcrypt from 'bcryptjs';
import settings from '../../../../../settings';
import FieldError from '../../../../common/FieldError';

import { createToken } from './token';

const SECRET = settings.auth.secret;

export const tryLogin = async (email, password, Auth) => {
  const e = new FieldError();
  const user = await Auth.getUserPasswordFromEmail(email);
  console.log(user);

  // check if email and password exist in db
  if (!user || user.password === null) {
    // user with provided email not found
    e.setError('email', 'Please enter a valid e-mail.');
    e.throwIf();
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    e.setError('password', 'Please enter a valid password.');
    e.throwIf();
  }

  if (settings.auth.password.confirm && !user.isActive) {
    e.setError('email', 'Please confirm your e-mail first.');
    e.throwIf();
  }

  const refreshSecret = SECRET + user.password;

  const [token, refreshToken] = await createToken(user, SECRET, refreshSecret);

  return {
    token,
    refreshToken
  };
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
    console.log(err);
    return {};
  }
};
