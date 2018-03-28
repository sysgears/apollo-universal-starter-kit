import defaultRouter from './defaultRouter/index.web';
import counter from './counter/index.web';
import post from './post/index.web';
import upload from './upload/index.web';
import user from './user/index.web';
import subscription from './subscription/index.web';
import contact from './contact/index.web';
import pageNotFound from './pageNotFound/index.web';
import './favicon';

import Feature from './connector.web';

export default new Feature(defaultRouter, counter, post, upload, user, subscription, contact, pageNotFound);
