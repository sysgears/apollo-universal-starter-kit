import defaultRouter from './defaultRouter/index.native';
import counter from './counter/index.native';
import post from './post/index.native';
import upload from './upload/index.native';
import user from './user/index.native';
import contact from './contact/index.native';
// import pageNotFound from './pageNotFound/index.native';
import './favicon';

import Feature from './connector.native';

export default new Feature(defaultRouter, counter, post, upload, user, contact);
