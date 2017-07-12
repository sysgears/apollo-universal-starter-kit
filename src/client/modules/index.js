import './favicon';
import counter from './counter';
import post from './post';
import language from './language';
import pageNotFound from './page-not-found';

import Feature from './connector';

export default new Feature(counter, post, language, pageNotFound);
