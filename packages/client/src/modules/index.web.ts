// Since awesome-typescript-loader doesn't take into account none of the webpack resolve extensions,
// there is no way to import a single index file so far (https://github.com/Microsoft/TypeScript/issues/10939).
//
// That's why it was decided to split index.web.{ts,tsx} and index.native.{ts,tsx} files explicitly
// and stick with this approach until we are able to get back to the previous one.

import contact from './contact/index.web';
import counter from './counter/index.web';
import defaultRouter from './defaultRouter/index.web';
import './favicon';
import pageNotFound from './pageNotFound/index.web';
import post from './post/index.web';
import subscription from './subscription/index.web';
import upload from './upload/index.web';
import user from './user/index.web';

import Feature from './connector.web';

export default new Feature(defaultRouter, counter, post, upload, subscription, contact, user, pageNotFound);
