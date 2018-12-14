import core from '@module/core-server-ts';
import i18n from '@module/i18n-server-ts';
import validation from '@module/validation-common-react';
import counter from '@module/counter-server-ts';
import chat from '@module/chat-server-ts';
import contact from '@module/contact-server-ts';

import cookies from './modules/cookies';
import post from './modules/post';
import upload from './modules/upload';
import user from './modules/user';
import subscription from './modules/payments';
import mailer from './modules/mailer';
import graphqlTypes from './modules/graphqlTypes';
import './modules/debug';

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
  graphqlTypes,
  core
);

export default modules;
