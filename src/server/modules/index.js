import counter from './counter';
import post from './post';
import graphql_types from './graphql_types';
import './debug';

import Feature from './connector';

export default new Feature(counter, post, graphql_types);
