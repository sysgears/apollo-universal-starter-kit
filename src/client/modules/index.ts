import counter from './counter/index.web';
import post from './post/index.web';
// import upload from './upload';
// import user from './user';
// import pageNotFound from './pageNotFound';
// import './favicon';

import Feature from './connector';

// export default new Feature(counter, post, upload, user, pageNotFound);
export default new Feature(counter, post);
