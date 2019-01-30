import AccessModule from '../AccessModule';
import settings from '../../../../../settings';
import { MESSAGE_APPEND_CONTEXT } from '../errorMessages';

const getCurrentIdentity = async ({ req, getIdentity }) => {
  if (req && req.headers['authorization']) {
    // eslint-disable-next-line
    const [, serial, ...rest] = req.headers['authorization'].split(' ');

    if (serial) {
      return getIdentity(null, serial);
    }
  }
};

const createContextFunc = async ({ req, context }) => {
  const { getIdentity, appendContext } = context;

  if (!appendContext) {
    throw new Error(MESSAGE_APPEND_CONTEXT);
  }

  if (getIdentity) {
    const identity = context.identity || (await getCurrentIdentity({ req, getIdentity }));

    return {
      identity,
      ...appendContext(identity)
    };
  }
};

export default new AccessModule(
  settings.auth.serial.enabled
    ? {
        createContextFunc: [createContextFunc]
      }
    : {}
);
