import settings from '@gqlapp/config';

import AccessModule from '../AccessModule';

const getCurrentIdentity = async ({ req, getIdentity }) => {
  if (req && req.headers['authorization']) {
    const [, serial] = req.headers['authorization'].split(' ');

    if (serial) {
      return getIdentity(null, serial);
    }
  }
};

const createContextFunc = async ({ req, appContext }) => {
  const { getIdentity } = appContext;

  if (getIdentity) {
    req.identity = req.identity || (await getCurrentIdentity({ req, getIdentity }));
  }
};

export default new AccessModule(
  settings.auth.serial.enabled
    ? {
        createContextFunc: [createContextFunc]
      }
    : {}
);
