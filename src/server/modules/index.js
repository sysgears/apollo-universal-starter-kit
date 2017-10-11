import counter from './counter';
import post from './post';
import user from './user';
import mailer from './mailer';
import graphqlTypes from './graphqlTypes';
import apolloEngine from './apolloEngine';
import './debug';

import Feature from './connector';

export default new Feature(counter, post, user, mailer, graphqlTypes, apolloEngine);
