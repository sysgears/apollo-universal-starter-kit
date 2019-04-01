import { pick, isEmpty } from 'lodash';
import jwt from 'jsonwebtoken';

import { UserInputError } from 'apollo-server-errors';
import mailer from '@gqlapp/mailer-server-ts';
import { log } from '@gqlapp/core-common';

import User from '../../sql';
import settings from '../../../../../settings';

const resetPasswordController = async ({ body: input }, res) => {
  const errors = {};

  const reset = pick(input, ['password', 'passwordConfirmation', 'token']);
  if (reset.password !== reset.passwordConfirmation) {
    errors.password = 'user:auth.password.passwordsIsNotMatch';
  }

  if (reset.password.length < settings.auth.password.minLength) {
    errors.password = 'user:auth.password.passwordLength';
  }

  if (!isEmpty(errors)) throw new UserInputError('Failed reset password', { errors });

  const token = Buffer.from(reset.token, 'base64').toString();
  const { email, password } = jwt.verify(token, settings.auth.secret);
  const user = await User.getUserByEmail(email);
  if (user.passwordHash !== password) {
    throw new Error('user:auth.password.invalidToken');
  }
  if (user) {
    await User.updatePassword(user.id, reset.password);
    const url = `${__WEBSITE_URL__}/profile`;

    if (mailer && settings.auth.password.sendPasswordChangesEmail) {
      mailer.sendMail({
        from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Your Password Has Been Updated',
        html: `<p>As you requested, your account password has been updated.</p>
                 <p>To view or edit your account settings, please visit the “Profile” page at</p>
                 <p><a href="${url}">${url}</a></p>`
      });
      log.info(`Sent password has been updated to: ${user.email}`);
      res.json({ message: 'ok' });
    }
  }
};

export default resetPasswordController;
