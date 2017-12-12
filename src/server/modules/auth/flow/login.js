import bcrypt from 'bcryptjs';
import settings from '../../../../../settings';
import FieldError from '../../../../common/FieldError';

import Auth from '../../auth/sql';

import { createToken } from './token';

const SECRET = settings.auth.secret;

export const tryLogin = async (email, password) => {
  const e = new FieldError();
  const user = await Auth.getUserPasswordFromEmail(email);

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

  if (settings.user.auth.password.confirm && !user.isActive) {
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

export const tryLoginSerial = async serial => {
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
