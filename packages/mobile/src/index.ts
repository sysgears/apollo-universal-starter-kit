import core from '@module/core-client-react-native';
import i18n from '@module/i18n-client-react';
import counter from '@module/counter-client-react';
import chat from '@module/chat-client-react';
import contact from '@module/contact-client-react';
import validation from '@module/validation-common-react';
import defaultRouter from '@module/router-client-react-native';

import user from '../../client/src/modules/user';
import payments from '../../client/src/modules/payments';

import ClientModule from '@module/module-client-react-native';

const post = require('@module/post-client-react').default;
const upload = require('@module/upload-client-react').default;
const pagination = require('@module/pagination-client-react').default;

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
  core
);

modules.triggerOnAppCreate();

export default modules;
