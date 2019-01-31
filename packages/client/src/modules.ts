import core from '@gqlapp/core-client-react';
import look from '@gqlapp/look-client-react';
import i18n from '@gqlapp/i18n-client-react';
import counter from '@gqlapp/counter-client-react';
import chat from '@gqlapp/chat-client-react';
import contact from '@gqlapp/contact-client-react';
import validation from '@gqlapp/validation-common-react';
import ClientModule from '@gqlapp/module-client-react';
import defaultRouter from '@gqlapp/router-client-react';
import payments from '@gqlapp/payments-client-react';
import '@gqlapp/favicon-common';

const post = require('@gqlapp/post-client-react').default;
const pageNotFound = require('@gqlapp/page-not-found-client-react').default;
const upload = require('@gqlapp/upload-client-react').default;
const pagination = require('@gqlapp/pagination-client-react').default;
const user = require('@gqlapp/user-client-react').default;
const firebase = require('@gqlapp/firebase-client-react').default;

import settings from '../../../settings';

const modules = new ClientModule(
  look,
  validation,
  defaultRouter,
  counter,
  post,
  upload,
  contact,
  pagination,
  chat,
  payments,
  settings.user.auth.firebase.enabled ? firebase : user,
  i18n,
  pageNotFound,
  core
);

export default modules;
