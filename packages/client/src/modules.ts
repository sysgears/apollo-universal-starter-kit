import core from '@module/core-client-react';
import look from '@module/look-client-react';
import i18n from '@module/i18n-client-react';
import counter from '@module/counter-client-react';
import chat from '@module/chat-client-react';
import contact from '@module/contact-client-react';
import validation from '@module/validation-common-react';
import ClientModule from '@module/module-client-react';
import defaultRouter from '@module/router-client-react';
import payments from '@module/payments-client-react';
import '@module/favicon-common';

const post = require('@module/post-client-react').default;
const pageNotFound = require('@module/page-not-found-client-react').default;
const upload = require('@module/upload-client-react').default;
const pagination = require('@module/pagination-client-react').default;
const user = require('@module/user-client-react').default;

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
  user,
  i18n,
  pageNotFound,
  core
);

export default modules;
