import counter from './counter/index.web';
import './favicon';
import pageNotFound from './pageNotFound';
import post from './post/index.web';
import upload from './upload/index.web';
import user from './user/index.web';

import Feature from './connector';

export default new Feature(counter, post, upload, user, pageNotFound);
