import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import TestModule from './components/TestModule';
import TestModuleEdit from './containers/TestModuleEdit';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: [
    <Route exact path="/testModule" component={TestModule} />,
    <Route exact path="/testModule/:id" component={TestModuleEdit} />
  ],
  navItem: (
    <MenuItem key="/testModule">
      <NavLink to="/testModule" className="nav-link" activeClassName="active">
        Test Module
      </NavLink>
    </MenuItem>
  ),
  reducer: { testModule: reducers }
});
