import bcrypt from 'bcryptjs';
import { pick, isEmpty } from 'lodash';
import jwt from 'jsonwebtoken';
import { UserInputError } from 'apollo-server-errors';

import mailer from '@gqlapp/mailer-server-ts';
import { log } from '@gqlapp/core-common';

import User from '../../sql';
import settings from '../../../../../settings';

const createPasswordHash = password => bcrypt.hash(password, 12) || false;

const registerController = async ({ body: input }, res) => {
  const errors = {};
  const userExists = await User.getUserByUsername(input.username);
  if (userExists) {
    errors.username = 'user:auth.password.usernameIsExisted';
  }

  const emailExists = await User.getUserByEmail(input.email);
  if (emailExists) {
    errors.email = 'user:auth.password.emailIsExisted';
  }

  if (!isEmpty(errors)) throw new UserInputError('Failed reset password', { errors });

  let userId = 0;
  if (!emailExists) {
    const passwordHash = await createPasswordHash(input.password);
    const isActive = !settings.auth.password.requireEmailConfirmation;
    [userId] = await User.register({ ...input, isActive }, passwordHash);

    // if user has previously logged with facebook auth
  } else {
    await User.updatePassword(emailExists.userId, input.password);
    userId = emailExists.userId;
  }

  const user = await User.getUser(userId);

  if (mailer && settings.auth.password.requireEmailConfirmation && !emailExists) {
    // async email
    jwt.sign({ identity: pick(user, 'id') }, settings.auth.secret, { expiresIn: '1d' }, (err, emailToken) => {
      const encodedToken = Buffer.from(emailToken).toString('base64');
      const url = `${__WEBSITE_URL__}/confirmation/${encodedToken}`;
      mailer.sendMail({
        from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Confirm Email',
        html: `<p>Hi, ${user.username}!</p>
          <p>Welcome to ${settings.app.name}. Please click the following link to confirm your email:</p>
          <p><a href="${url}">${url}</a></p>
          <p>Below are your login information</p>
          <p>Your email is: ${user.email}</p>`
      });
      log.info(`Sent registration confirmation email to: ${user.email}`);
    });
  }

  res.json({ user });
};

export default registerController;
