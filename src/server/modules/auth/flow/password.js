import bcrypt from 'bcryptjs';

import FieldError from '../../../../common/FieldError';
import settings from '../../../../../settings';

import AuthDAO from '../sql';

import { createToken } from './token';

const SECRET = settings.auth.secret;

const Auth = new AuthDAO();

const authn = settings.auth.authentication;

export const passwordRegister = async inputUser => {
  const e = new FieldError();

  const emailExists = await Auth.searchUserByEmail(inputUser.email);
  if (emailExists) {
    e.setError('email', 'E-mail already exists.');
  }

  // other validation of user input?

  e.throwIf();

  // set active or not
  let isActive = false;
  if (!authn.password.confirm) {
    isActive = true;
  }

  // set default profile if none provided
  if (!inputUser.profile) {
    inputUser.profile = {
      displayName: inputUser.email
    };
  }

  // Register User
  let newUser = await Auth.registerNewUser({
    email: inputUser.email,
    password: inputUser.password,
    isActive: isActive,
    profile: inputUser.profile
  });

  return newUser;
};

export const passwordLogin = async inputUser => {
  console.log('Password Login', inputUser);

  const e = new FieldError();

  const user = await Auth.getUserPasswordFromEmail(inputUser.email);

  console.log('PasswordLogin - user', user);

  // check if email and password exist in db
  if (!user || user.password === null) {
    // user with provided email not found
    e.setError('email', 'Please enter a valid e-mail.');
    e.throwIf();
  }

  const valid = await bcrypt.compare(inputUser.password, user.password);
  if (!valid) {
    // bad password
    e.setError('password', 'Please enter a valid password.');
    e.throwIf();
  }

  if (authn.password.enabled && authn.password.confirm && !user.isActive) {
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
