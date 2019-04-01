import { pick } from 'lodash';
import jwt from 'jsonwebtoken';

import mailer from '@gqlapp/mailer-server-ts';
import { log } from '@gqlapp/core-common';

import User from '../../sql';
import settings from '../../../../../settings';

const forgotPasswordController = async ({ body: input }, res) => {
  try {
    const localAuth = pick(input, 'email');
    const user = await User.getUserByEmail(localAuth.email);

    if (user && mailer) {
      // async email
      jwt.sign(
        { email: user.email, password: user.passwordHash },
        settings.auth.secret,
        { expiresIn: '1d' },
        (err, emailToken) => {
          // encoded token since react router does not match dots in params
          const encodedToken = Buffer.from(emailToken).toString('base64');
          const url = `${__WEBSITE_URL__}/reset-password/${encodedToken}`;
          mailer.sendMail({
            from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Reset Password',
            html: `Please click this link to reset your password: <a href="${url}">${url}</a>`
          });
          log.info(`Sent link to reset email to: ${user.email}`);
          res.json({ message: 'ok' });
        }
      );
    }
  } catch (e) {
    // don't throw error so you can't discover users this way
  }
};

export default forgotPasswordController;
