import core from '@module/core-client-react-native';
import i18n from '@module/i18n-client-react';
import counter from '@module/counter-client-react';
import chat from '@module/chat-client-react';
import contact from '@module/contact-client-react';
import validation from '@module/validation-common-react';

import defaultRouter from '../../client/src/modules/defaultRouter';
import post from '../../client/src/modules/post';
import upload from '../../client/src/modules/upload';
import user from '../../client/src/modules/user';
import payments from '../../client/src/modules/payments';
import pagination from '../../client/src/modules/pagination';

import ClientModule from '@module/module-client-react-native';

const modules: ClientModule = new ClientModule(
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

modules.triggerOnCreate();
