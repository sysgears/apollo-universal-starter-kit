import counter from './counter';
import user from './user';
import post from './post';
import pageNotFound from './page-not-found';
import './favicon';

import Feature from './connector';

export default new Feature(counter, user, post, pageNotFound);