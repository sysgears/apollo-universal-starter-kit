import counter from './counter';
import post from './post';
import upload from './upload';
// import user from './user';
// import mailer from './mailer';
// import graphql_types from './graphql_types';
// import './debug';

import Feature from './connector';

// export default new Feature(counter, post, user, graphql_types, mailer);
export default new Feature(counter, post, upload);
