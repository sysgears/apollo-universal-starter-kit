import counter from './counter';
import post from './post';
import upload from './upload';
import user from './user';
import mailer from './mailer';
import graphqlTypes from './graphqlTypes';
import uiBootstrap from './ui-bootstrap';
//import uiAntd from './ui-antd';
import './debug';

import Feature from './connector';

export default new Feature(counter, post, upload, user, mailer, graphqlTypes, uiBootstrap);
