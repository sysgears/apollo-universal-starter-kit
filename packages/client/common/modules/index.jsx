import counter from './counter';
import './favicon';
import post from './post';
import pageNotFound from './page-not-found';

import Feature from './connector';

export default new Feature(counter, post, pageNotFound);