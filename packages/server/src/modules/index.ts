import apolloEngine from './apolloEngine';
import counter from './counter';
import './debug';
import graphqlTypes from './graphqlTypes';
import mailer from './mailer';
import post from './post';
import upload from './upload';
import user from './user';

import Feature from './connector';

export default new Feature(counter, post, upload, user, mailer, graphqlTypes, apolloEngine);
