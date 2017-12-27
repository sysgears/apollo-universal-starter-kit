import React from 'react';
import { AuthRoute } from '../../auth/containers/Auth';

import Feature from '../connector';

import Main from './containers/Main';

export default new Feature({
  route: [<AuthRoute exact path="/admin" component={Main} />]
});
