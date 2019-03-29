import { pick, isEmpty } from 'lodash';
import bcrypt from 'bcryptjs';

import mailer from '@gqlapp/mailer-server-ts';
import { createTransaction } from '@gqlapp/database-server-ts';
import { log } from '@gqlapp/core-common';

import User from '../sql';
import settings from '../../../../settings';

const {
  auth: { certificate, password }
} = settings;

const createPasswordHash = password => {
  return bcrypt.hash(password, 12) || false;
};

const editUserController = async ({ body: input }, res) => {
  const isAdmin = () => true;
  const isSelf = () => true;

  const errors = {};

  const userExists = await User.getUserByUsername(input.username);
  if (userExists && userExists.id !== input.id) {
    errors.username = 'user:usernameIsExisted';
  }

  const emailExists = await User.getUserByEmail(input.email);
  if (emailExists && emailExists.id !== input.id) {
    errors.email = 'user:emailIsExisted';
  }

  if (input.password && input.password.length < password.minLength) {
    errors.password = 'user:passwordLength';
  }

  if (!isEmpty(errors)) throw new Error('Failed to get events due to validation errors');

  const userInfo = !isSelf() && isAdmin() ? input : pick(input, ['id', 'username', 'email', 'password']);

  const isProfileExists = await User.isUserProfileExists(input.id);
  const passwordHash = await createPasswordHash(input.password);

  const trx = await createTransaction();
  try {
    await User.editUser(userInfo, passwordHash).transacting(trx);
    await User.editUserProfile(input, isProfileExists).transacting(trx);

    if (mailer && input.password && password.sendPasswordChangesEmail) {
      const url = `${__WEBSITE_URL__}/profile`;

      mailer.sendMail({
        from: `${settings.app.name} <${process.env.EMAIL_USER}>`,
        to: input.email,
        subject: 'Your Password Has Been Updated',
        html: `<p>Your account password has been updated.</p>
                 <p>To view or edit your account settings, please visit the “Profile” page at</p>
                 <p><a href="${url}">${url}</a></p>`
      });
      log.info(`Sent password has been updated to: ${input.email}`);
    }
    trx.commit();
  } catch (e) {
    trx.rollback();
  }

  if (certificate.enabled) {
    await User.editAuthCertificate(input);
  }

  try {
    const user = await User.getUser(input.id);

    res.json(user);
  } catch (e) {
    throw e;
  }
};

export default editUserController;
