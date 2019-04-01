import bcrypt from 'bcryptjs';
import { isEmpty } from 'lodash';

import { UserInputError } from 'apollo-server-errors';
import { access } from '@gqlapp/authentication-server-ts';

import User from '../../sql';
import settings from '../../../../../settings';

const validateUserPassword = async (user, password, t) => {
  if (!user) {
    // user with provided email not found
    return { usernameOrEmail: t('user:auth.password.validPasswordEmail') };
  }

  if (settings.auth.password.requireEmailConfirmation && !user.isActive) {
    return { usernameOrEmail: t('user:auth.password.emailConfirmation') };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    // bad password
    return { usernameOrEmail: t('user:auth.password.validPassword') };
  }
};

const loginController = async (req, res) => {
  const {
    body: { usernameOrEmail, password }
  } = req;
  const user = await User.getUserByUsernameOrEmail(usernameOrEmail);

  const errors = await validateUserPassword(user, password, req.t);
  if (!isEmpty(errors)) throw new UserInputError('Failed valid user password', { errors });

  const tokens = await access.grantAccess(user, req, user.passwordHash);

  res.json({ user, tokens });
};

export default loginController;
