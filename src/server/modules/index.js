import counter from './counter';
import user from './user';
import post from './post';
import graphql_types from './graphql_types';
import './debug';

import Feature from './connector';

export default new Feature(counter, user, post, graphql_types);
