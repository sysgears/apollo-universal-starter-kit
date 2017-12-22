import { counter } from './counter/index.web';
// import './favicon';
// import { pageNotFound } from './pageNotFound';
// import { post } from './post/index.web';
// import { uiAntd } from './ui-antd/index.web';
import { uiBootstrap } from './ui-bootstrap/index.web';
// import { upload } from './upload/index.web';
// import { user } from './user/index.web';

import { Feature } from './connector';

export const modules = new Feature(counter, uiBootstrap);
