import counter from './counter';
// import graphql_types from './graphql_types';
import './debug';
import mailer from './mailer';
import post from './post';
import user from './user';

import Feature from './connector';

// export default new Feature(counter, post, user, graphql_types, mailer);
export default new Feature(counter, post, user, mailer);
