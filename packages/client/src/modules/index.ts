import i18n from '@module/i18n-client-react';
import counter from '@module/counter-client-react';
import chat from '@module/chat-client-react';
import contact from '@module/contact-client-react';
import validation from '@module/validation-common-react';
import ClientModule from '@module/module-client-react';

import defaultRouter from './defaultRouter';
import post from './post';
import upload from './upload';
import user from './user';
import payments from './payments';
import pageNotFound from './pageNotFound';
import pagination from './pagination';
import './favicon';

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
  pageNotFound
);
modules.triggerOnCreate();

export default modules;
