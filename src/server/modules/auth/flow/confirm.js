import jwt from 'jsonwebtoken';
import url from 'url';
import { pick } from 'lodash';

import settings from '../../../../../settings';

import UserDAO from '../../entities/user';

const User = new UserDAO();

const SECRET = settings.auth.secret;

const { protocol, hostname, port } = url.parse(__BACKEND_URL__);
let serverPort = process.env.PORT || port;
if (__DEV__) {
  serverPort = '3000';
}

export const confirmAccountHandler = async (req, res) => {
  try {
    const token = Buffer.from(req.params.token, 'base64').toString();
    const { user: { id } } = jwt.verify(token, SECRET);

    await User.updateActive(id, true);
  } catch (e) {
    return res.send('error');
  }

  // maybe we should log them in automatically here? and redirect to profile
  return res.redirect('/login');
};

export const sendConfirmAccountEmail = async (mailer, user) => {
  jwt.sign({ user: pick(user, 'id') }, SECRET, { expiresIn: '1d' }, (err, emailToken) => {
    const encodedToken = Buffer.from(emailToken).toString('base64');
    const url = `${protocol}//${hostname}:${serverPort}/confirmation/${encodedToken}`;
    mailer.sendMail({
      from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Confirm Your Account',
      html: `<p>Hi there!</p>
      <p>Welcome to ${settings.app.name}. Please click the following link to confirm your account:</p>
      <p><a href="${url}">${url}</a></p>`
    });
  });
};
