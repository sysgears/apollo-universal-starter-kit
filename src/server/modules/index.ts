import counter from './counter';
import './debug';
import mailer from './mailer';
import post from './post';
import upload from './upload';
import user from './user';
// import graphql_types from './graphql_types';

import Feature from './connector';

// export default new Feature(counter, post, user, graphql_types, mailer);
export default new Feature(counter, post, user, mailer, upload);
