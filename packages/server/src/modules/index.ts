import cookies from './cookies';
import i18n from './i18n';
import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import subscription from './subscription';
import contact from './contact';
import mailer from './mailer';
import graphqlTypes from './graphqlTypes';
import './debug';

import Feature from './connector';

export default new Feature(cookies, i18n, counter, post, upload, user, subscription, contact, mailer, graphqlTypes);
