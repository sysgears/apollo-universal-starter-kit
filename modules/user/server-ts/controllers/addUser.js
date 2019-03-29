import { pick, isEmpty } from 'lodash';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import mailer from '@gqlapp/mailer-server-ts';
import { createTransaction } from '@gqlapp/database-server-ts';
import { log } from '@gqlapp/core-common';

import User from '../sql';
import settings from '../../../../settings';

const {
  auth: { secret, certificate, password },
  app
} = settings;

const createPasswordHash = password => {
  return bcrypt.hash(password, 12) || false;
};

const addUserController = async ({ body: input }, res) => {
  const errors = {};

  const userExists = await User.getUserByUsername(input.username);
  if (userExists) {
    errors.username = 'user:usernameIsExisted';
  }

  const emailExists = await User.getUserByEmail(input.email);
  if (emailExists) {
    errors.email = 'user:emailIsExisted';
  }

  if (input.password.length < password.minLength) {
    errors.password = 'user:passwordLength';
  }

  if (!isEmpty(errors)) throw new Error('Failed to get events due to validation errors');

  const passwordHash = await createPasswordHash(input.password);

  const trx = await createTransaction();
  let createdUserId;
  try {
    const isActive = password.requireEmailConfirmation ? input.isActive || false : !password.requireEmailConfirmation;

    [createdUserId] = await User.register({ ...input, isActive }, passwordHash).transacting(trx);
    await User.editUserProfile({ id: createdUserId, ...input }).transacting(trx);
    if (certificate.enabled) await User.editAuthCertificate({ id: createdUserId, ...input }).transacting(trx);
    trx.commit();
  } catch (e) {
    trx.rollback();
  }

  try {
    const user = await User.getUser(createdUserId);

    if (mailer && password.requireEmailConfirmation && !emailExists) {
      // async email
      jwt.sign({ identity: pick(user, 'id') }, secret, { expiresIn: '1d' }, (err, emailToken) => {
        const encodedToken = Buffer.from(emailToken).toString('base64');
        const url = `${__WEBSITE_URL__}/confirmation/${encodedToken}`;
        mailer.sendMail({
          from: `${app.name} <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: 'Your account has been created',
          html: `<p>Hi, ${user.username}!</p>
            <p>Welcome to ${app.name}. Please click the following link to confirm your email:</p>
            <p><a href="${url}">${url}</a></p>
            <p>Below are your login information</p>
            <p>Your email is: ${user.email}</p>`
        });
        log.info(`Sent registration confirmation email to: ${user.email}`);
      });
    }

    res.json({ user });
  } catch (e) {
    return e;
  }
};

export default addUserController;
