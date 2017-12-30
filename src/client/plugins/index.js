import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import subscription from './subscription';
import contact from './contact';
import pageNotFound from './pageNotFound';
import './favicon';

import Plugin from './plugin';

export default new Plugin(counter, post, upload, user, subscription, contact, pageNotFound);
