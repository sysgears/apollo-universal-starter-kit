import AccessModule from '../AccessModule';
import settings from '../../../../../settings';

const getCurrentIdentity = async ({ req, getIdentity }) => {
  if (req && req.headers['authorization']) {
    const [, serial] = req.headers['authorization'].split(' ');

    if (serial) {
      return getIdentity(null, serial);
    }
  }
};

const createContextFunc = async ({ req, req: { t } }, context) => {
  const { getIdentity, appendContext } = context;

  if (!appendContext) {
    throw new Error(t('auth:appendContext'));
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
