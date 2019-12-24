import { isApiExternal } from '@gqlapp/core-common';
import settings from '@gqlapp/config';

import { writeSession, createSession, readSession } from './sessions';
import AccessModule from '../AccessModule';
import schema from './schema.graphql';
import resolvers from './resolvers';

const grant = async ({ id }, req) => {
  const session = { ...req.session, id };
  req.session = writeSession(req, session);
};

const getCurrentIdentity = async ({ req, getIdentity }) => {
  if (req && req.session.id) {
    return getIdentity(req.session.id);
  }
};

const attachSession = req => {
  if (req) {
    req.session = readSession(req);
    if (!req.session) {
      req.session = createSession(req);
    } else {
      if (!isApiExternal && req.path === __API_URL__) {
        if (req.universalCookies.get('x-token') !== req.session.csrfToken) {
          req.session = createSession(req);
          throw new Error(req.t('auth:invalidCsrf'));
        }
      }
    }
  }
};

const createContextFunc = async ({ req, appContext }) => {
  const { getIdentity } = appContext;

  attachSession(req);

  if (req && getIdentity) {
    req.identity = req.identity || (await getCurrentIdentity({ req, getIdentity }));
  }
};

export default new AccessModule(
  settings.auth.session.enabled
    ? {
        grant: [grant],
        schema: [schema],
        createResolversFunc: [resolvers],
        createContextFunc: [createContextFunc]
      }
    : {}
);
