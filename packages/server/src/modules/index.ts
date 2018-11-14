import i18n from '@module/i18n-server';
import validation from '@module/validation';
import counter from '@module/counter-server';

import cookies from './cookies';
import post from './post';
import upload from './upload';
import user from './user';
import subscription from './payments';
import contact from './contact';
import mailer from './mailer';
import chat from './chat';
import graphqlTypes from './graphqlTypes';
import './debug';

import ServerModule from '@module/module-server';

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
modules.triggerOnCreate();

export default modules;
