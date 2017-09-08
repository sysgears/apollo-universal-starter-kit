import counter from './counter';
import post from './post';
import user from './user';
import pageNotFound from './page-not-found';
import './favicon';

import Feature from './connector';

export default new Feature(counter, post, user, pageNotFound);
