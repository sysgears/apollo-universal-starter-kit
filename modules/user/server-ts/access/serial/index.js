import { AuthenticationError } from 'apollo-server-errors';

import AccessModule from '../AccessModule';
import settings from '../../../../../settings';

import User from '../../sql';

const getCurrentUser = async ({ req }) => {
  const authorization = req && req.headers['authorization'];
  const parts = authorization && authorization.split(' ');
  const serial = parts && parts.length === 2 && parts[1];
  if (serial) {
    const user = await User.getUserWithSerial(serial)
    return user;
  }
};

const createContextFunc = async ({ req, connectionParams, webSocket, context }) => {
  try {
    context.user = context.user || (await getCurrentUser({ req, connectionParams, webSocket }));
  } catch (e) {
    throw new AuthenticationError(e);
  }
};

export default new AccessModule(
  settings.user.auth.access.serial.enabled
    ? {
        createContextFunc: [createContextFunc]
      }
    : {}
);

