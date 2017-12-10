import bcrypt from 'bcryptjs';
import settings from '../../../../../settings';
import FieldError from '../../../../common/FieldError';

import { createToken } from './token';

export const tryLogin = async (email, password, User, SECRET) => {
  const e = new FieldError();
  const user = await User.getUserByEmail(email);

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

export const tryLoginSerial = async (serial, User, SECRET) => {
  try {
    const certAuth = await User.getUserWithSerial(serial);

    const user = await User.getUserWithPassword(certAuth.id);

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
