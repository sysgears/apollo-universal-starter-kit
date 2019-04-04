import { pick, isEmpty } from 'lodash';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { mailer } from '@gqlapp/mailer-server-ts';
import { createTransaction } from '@gqlapp/database-server-ts';
import { log } from '@gqlapp/core-common';

import User from './sql';
import settings from '../../../settings';

const {
  auth: { secret, certificate, password },
  app
} = settings;

const createPasswordHash = password => {
  return bcrypt.hash(password, 12) || false;
};

const getUsers = async ({ body: { column, order, searchText = '', role = '', isActive = null } }, res) => {
  const {
    locals: { identity, t }
  } = res;

  if (!identity || identity.role !== 'admin') {
    res.status(401).json(t('user:accessDenied'));
    return;
  }

  const orderBy = { column, order };
  const filter = { searchText, role, isActive };
  const users = await User.getUsers(orderBy, filter);

  res.json(users);
};

const getUser = ({ body: { id } }, res) => {
  const {
    locals: { identity, t }
  } = res;

  if ((identity && identity.id === id) || identity.role === 'admin') {
    try {
      res.json({ user: User.getUser(id) });
    } catch (e) {
      res.status(500).json(e);
    }
  }

  res.status(401).json(t('user:accessDenied'));
};

const currentUser = (req, res) => {
  const {
    locals: { identity }
  } = res;

  if (identity) {
    return User.getUser(identity.id);
  } else {
    return null;
  }
};

const addUser = async ({ body: input }, res) => {
  const errors = {};
  const {
    locals: { t }
  } = res;

  const userExists = await User.getUserByUsername(input.username);
  if (userExists) {
    errors.username = t('user:usernameIsExisted');
  }

  const emailExists = await User.getUserByEmail(input.email);
  if (emailExists) {
    errors.email = t('user:emailIsExisted');
  }

  if (input.password.length < password.minLength) {
    errors.password = t('user:passwordLength');
  }

  if (!isEmpty(errors)) {
    res.status(422).json({ message: 'Failed to get events due to validation errors', errors });
    return;
  }

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
    console.log(e);
  }
};

const editUser = async ({ body: input }, res) => {
  const {
    locals: { identity, t }
  } = res;

  if (!identity) {
    res.status(401).json(t('user:accessDenied'));
    return;
  }

  const isAdmin = () => identity.role === 'admin';
  const isSelf = () => identity.id === input.id;

  const errors = {};

  const userExists = await User.getUserByUsername(input.username);
  if (userExists && userExists.id !== input.id) {
    errors.username = t('user:usernameIsExisted');
  }

  const emailExists = await User.getUserByEmail(input.email);
  if (emailExists && emailExists.id !== input.id) {
    errors.email = t('user:emailIsExisted');
  }

  if (input.password && input.password.length < password.minLength) {
    errors.password = t('user:passwordLength');
  }

  if (!isEmpty(errors)) res.status(422).json({ message: 'Failed to get events due to validation errors', errors });

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
    trx.rollback(e);
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

const deleteUser = async ({ body: { id } }, res) => {
  const {
    locals: { identity, t }
  } = res;
  if (!identity) {
    res.status(401).json(t('user:accessDenied'));
    return;
  }

  const isAdmin = () => identity.role === 'admin';
  const isSelf = () => identity.id === id;

  const user = await User.getUser(id);
  if (!user) {
    throw new Error(t('userIsNotExisted'));
  }

  if (isSelf()) {
    throw new Error(t('userCannotDeleteYourself'));
  }

  const isDeleted = !isSelf() && isAdmin() ? await User.deleteUser(id) : false;

  if (isDeleted) {
    res.json(user);
  } else {
    throw new Error(t('userCouldNotDeleted'));
  }
};

const restApi = [
  { route: '/getUsers', controller: getUsers, method: 'GET' },
  { route: '/getUser', controller: getUser, method: 'GET' },
  { route: '/getCurrentUser', controller: currentUser, method: 'GET' },
  { route: '/addUser', controller: addUser, method: 'POST' },
  { route: '/editUser', controller: editUser, method: 'PUT' },
  { route: '/deleteUser', controller: deleteUser, method: 'DELETE' }
];

export default restApi;
