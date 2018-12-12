import i18n from '@module/i18n-server-ts';
import validation from '@module/validation-common-react';
import counter from '@module/counter-server-ts';
import chat from '@module/chat-server-ts';
import contact from '@module/contact-server-ts';

import cookies from './cookies';
import post from './post';
import upload from './upload';
import user from './user';
import subscription from './payments';
import mailer from './mailer';
import graphqlTypes from './graphqlTypes';
import './debug';

import ServerModule from '@module/module-server-ts';

const modules: ServerModule = new ServerModule(
  cookies,
  i18n,
  validation,
  counter,
  post,
  upload,
  user,
  subscription,
  contact,
  mailer,
  chat,
  graphqlTypes
);

modules.triggerOnAppCreate();

export default modules;
