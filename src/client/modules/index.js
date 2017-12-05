import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import pageNotFound from './pageNotFound';
import subscription from './subscription';
import './favicon';

import Feature from './connector';

export default new Feature(counter, post, upload, user, subscription, pageNotFound);
