import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import pageNotFound from './pageNotFound';
import './favicon';
import ui from './ui-bootstrap';
//import ui from './ui-antd';

import Feature from './connector';

export default new Feature(counter, post, upload, user, pageNotFound, ui);
