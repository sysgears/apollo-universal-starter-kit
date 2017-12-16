import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import subscription from './subscription';
import contact from './contact';
import pageNotFound from './pageNotFound';
import './favicon';

import Feature from './connector';

import settings from '../../../settings';

// On by default features
let features = [counter, post, upload, user, contact];

// Configurable features
if (settings.subscription.enabled) {
  features.push(subscription);
}

// This should be last because of routing?
features.push(pageNotFound);

export default new Feature(...features);
