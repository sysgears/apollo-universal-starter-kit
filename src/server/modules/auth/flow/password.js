import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import url from 'url';

import FieldError from '../../../../common/FieldError';
import settings from '../../../../../settings';

import AuthDAO from '../lib';
import UserDAO from '../../entities/user/lib';

import { createToken } from './token';

const SECRET = settings.auth.secret;

const Auth = new AuthDAO();
const User = new UserDAO();

const authn = settings.auth.authentication;

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

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
    refreshToken,
    user
  };
};

export const sendPasswordResetEmail = async (mailer, inputUser) => {
  console.log('Password Forget', inputUser);

  const user = await User.getByEmail(inputUser.email);

  if (user) {
    // async email
    jwt.sign({ email: user.email }, SECRET, { expiresIn: '1d' }, (err, emailToken) => {
      // encoded token since react router does not match dots in params
      const encodedToken = Buffer.from(emailToken).toString('base64');
      const url = `${protocol}//${hostname}:${serverPort}/reset-password/${encodedToken}`;
      mailer.sendMail(
        {
          from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Reset Password',
          html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
        },
        error => {
          if (error) {
            return console.log('error', error);
          }
        }
      );
    });
  } else {
    console.log('unknown user', inputUser.email);
  }
};

export const passwordReset = async inputUser => {
  console.log('passwordReset', inputUser);

  const e = new FieldError();
  const reset = {
    token: inputUser.token,
    password: inputUser.password,
    passwordConfirmation: inputUser.passwordConfirmation
  };
  console.log('passwordReset', reset);
  if (reset.password !== reset.passwordConfirmation) {
    e.setError('password', 'Passwords do not match.');
  }

  if (reset.password.length < 5) {
    e.setError('password', `Password must be 5 characters or more.`);
  }
  e.throwIf();

  const token = Buffer.from(reset.token, 'base64').toString();
  const { email } = jwt.verify(token, SECRET);
  console.log('passwordReset', email);
  const user = await User.getByEmail(email);
  if (user.email !== email) {
    e.setError('token', 'Invalid token');
    e.throwIf();
  }

  console.log('passwordReset', user);
  if (user) {
    let ret = await Auth.updatePassword(user.id, reset.password);
    console.log('passwordReset', ret);
  }
};
