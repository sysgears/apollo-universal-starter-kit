import counter from './counter';
import post from './post';
import user from './user';
import graphqlTypes from './graphqlTypes';
import './debug';

import Feature from './connector';

export default new Feature(counter, post, user, graphqlTypes);
