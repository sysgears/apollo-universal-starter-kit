import jwt from 'jsonwebtoken';
import url from 'url';
import { pick } from 'lodash';

import settings from '../../../../../settings';

import UserDAO from '../../entities/user/lib';
import AuthDAO from '../sql';

import { createToken, setTokenHeaders, setResponseTokenHeaders } from './token';

const User = new UserDAO();
const Auth = new AuthDAO();

const SECRET = settings.auth.secret;

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

export const confirmAccountHandler = async (req, res) => {
  console.log('Confirm Account Handler', req.params);
  try {
    const confirmToken = Buffer.from(req.params.token, 'base64').toString();
    const decoded = jwt.verify(confirmToken, SECRET);

    await User.update(decoded.user.id, {
      isActive: true
    });

    const user = await Auth.getUserWithPassword(decoded.user.id);
    console.log('Confirmed User:', user);

    const refreshSecret = SECRET + user.password;
    const [token, refreshToken] = await createToken(user, SECRET, refreshSecret);
    const tokens = {
      token,
      refreshToken
    };
    console.log('tokens', tokens);
    setTokenHeaders(req, tokens);
    setResponseTokenHeaders(res, tokens);

    // Send them on their way to success
    return res.redirect('/profile');
    // return res.redirect(settings.auth.authentication.loginSuccessRedirect)
  } catch (e) {
    console.log('error', e);
    return res.send('error');
  }

  // maybe we should log them in automatically here? and redirect to profile
  // return res.redirect('/login');
};

export const sendConfirmAccountEmail = async (mailer, user) => {
  jwt.sign({ user: pick(user, 'id') }, SECRET, { expiresIn: '1d' }, (err, emailToken) => {
    const encodedToken = Buffer.from(emailToken).toString('base64');
    const url = `${protocol}//${hostname}:${serverPort}/confirmation/${encodedToken}`;
    mailer.sendMail(
      {
        from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Confirm Your Account',
        html: `<p>Hi there!</p>
      <p>Welcome to ${settings.app.name}. Please click the following link to confirm your account:</p>
      <p><a href="${url}">${url}</a></p>`
      },
      error => {
        if (error) {
          return console.log('error', error);
        }
      }
    );
  });
};
