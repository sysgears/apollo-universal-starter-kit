import { isApiExternal } from '@module/core-common';

import { writeSession, createSession, readSession } from './sessions';
import AccessModule from '../AccessModule';
import schema from './schema.graphql';
import resolvers from './resolvers';
import settings from '../../../../../settings';
import { MESSAGE_APPEND_CONTEXT, MESSAGE_INVALID_CSRF } from '../errorMessages';

const grant = async ({ id }, req) => {
  const session = { ...req.session, id };
  req.session = writeSession(req, session);
};

const getCurrentIdentity = async ({ req, getIdentity }) => {
  if (req && req.session.id) {
    return await getIdentity(req.session.id);
  }
};

const checkCSRFToken = req => {
  if (isApiExternal && req.path !== __API_URL__) {
    return false;
  }

  if (req.universalCookies.get('x-token') !== req.session.csrfToken) {
    req.session = createSession(req);
    throw new Error(MESSAGE_INVALID_CSRF);
  }
};

const attachSession = req => {
  if (!req) {
    return false;
  }

  req.session = readSession(req);
  return req.session ? checkCSRFToken(req) : (req.session = createSession(req));
};

const createContextFunc = async ({ req, context }) => {
  const { getIdentity, appendContext } = context;

  if (!appendContext) {
    throw new Error(MESSAGE_APPEND_CONTEXT);
  }

  attachSession(req);
  const identity = context.identity || (await getCurrentIdentity({ req, getIdentity }));

  return {
    identity,
    ...appendContext(identity)
  };
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
