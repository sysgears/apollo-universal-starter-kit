import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { constructUploadOptions } from 'apollo-fetch-upload';
import { MenuItem } from '../../../../client/src/modules/common/components/web';

// Component and helpers
import Upload from './containers/Upload';
import reducers from './reducers';

import { Connector } from 'connector-js';

export default new Connector({
  catalogInfo: { upload: true },
  route: <Route exact path="/upload" component={Upload} />,
  navItem: (
    <MenuItem key="/upload">
      <NavLink to="/upload" className="nav-link" activeClassName="active">
        Upload
      </NavLink>
    </MenuItem>
  ),
  reducer: { upload: reducers },
  createFetchOptions: constructUploadOptions
});
