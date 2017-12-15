import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { constructUploadOptions } from 'apollo-fetch-upload';
import { MenuItem } from '../../modules/common/components/web';

// Component and helpers
import Upload from './containers/Upload';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
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
