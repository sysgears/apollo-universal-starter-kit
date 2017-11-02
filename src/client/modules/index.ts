import counter from './counter/index.web';
// import user from './user';
import pageNotFound from './pageNotFound';
import post from './post/index.web';
import upload from './upload/index.web';
// import './favicon';

import Feature from './connector';

// export default new Feature(counter, post, upload, user, pageNotFound);
export default new Feature(counter, post, upload, pageNotFound);
