import cookies from './cookies';
import i18n from './i18n';
import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import subscription from './payments';
import contact from './contact';
import mailer from './mailer';
import graphqlTypes from './graphqlTypes';
import './debug';

import ServerModule from './ServerModule';

export default new ServerModule(
  cookies,
  i18n,
  counter,
  post,
  upload,
  user,
  subscription,
  contact,
  mailer,
  graphqlTypes
);
