import core from '@gqlapp/core-client-react-native';
import i18n from '@gqlapp/i18n-client-react';
import counter from '@gqlapp/counter-client-react';
import chat from '@gqlapp/chat-client-react';
import contact from '@gqlapp/contact-client-react';
import validation from '@gqlapp/validation-common-react';
import defaultRouter from '@gqlapp/router-client-react-native';
import payments from '@gqlapp/payments-client-react';
import authentication from '@gqlapp/authentication-client-react';

import ClientModule from '@gqlapp/module-client-react-native';

const post = require('@gqlapp/post-client-react').default;
const upload = require('@gqlapp/upload-client-react').default;
const pagination = require('@gqlapp/pagination-client-react').default;
const user = require('@gqlapp/user-client-react').default;

const modules = new ClientModule(
  validation,
  defaultRouter,
  counter,
  post,
  upload,
  contact,
  pagination,
  chat,
  payments,
  user,
  i18n,
  core,
  authentication
);

export default modules;
