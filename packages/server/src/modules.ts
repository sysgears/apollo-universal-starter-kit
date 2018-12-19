import core from '@module/core-server-ts';
import i18n from '@module/i18n-server-ts';
import validation from '@module/validation-common-react';
import counter from '@module/counter-server-ts';
import chat from '@module/chat-server-ts';
import contact from '@module/contact-server-ts';
import cookies from '@module/cookies-server-ts';
import post from '@module/post-server-ts';
import upload from '@module/upload-server-ts';
import subscription from '@module/payments-server-ts';
import mailer from '@module/mailer-server-ts';
import graphqlTypes from '@module/graphql-types-server-ts';
import '@module/debug-server-ts';

import ServerModule from '@module/module-server-ts';

const user = require('@module/user-server-ts').default;

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
