import core from '@gqlapp/core-server-ts';
import i18n from '@gqlapp/i18n-server-ts';
import validation from '@gqlapp/validation-common-react';
import counter from '@gqlapp/counter-server-ts';
import chat from '@gqlapp/chat-server-ts';
import contact from '@gqlapp/contact-server-ts';
import cookies from '@gqlapp/cookies-server-ts';
import post from '@gqlapp/post-server-ts';
import upload from '@gqlapp/upload-server-ts';
import subscription from '@gqlapp/payments-server-ts';
import mailer from '@gqlapp/mailer-server-ts';
import graphqlTypes from '@gqlapp/graphql-types-server-ts';
import reports from '@gqlapp/reports-server-ts';
import '@gqlapp/debug-server-ts';

import ServerModule from '@gqlapp/module-server-ts';

const user = require('@gqlapp/user-server-ts').default;
const firebase = require('@gqlapp/firebase-server-ts').default;

import settings from '../../../settings';

const modules: ServerModule = new ServerModule(
  cookies,
  i18n,
  validation,
  counter,
  post,
  upload,
  settings.firebase.enabled ? firebase : user,
  subscription,
  contact,
  mailer,
  chat,
  reports,
  graphqlTypes,
  core
);

export default modules;
