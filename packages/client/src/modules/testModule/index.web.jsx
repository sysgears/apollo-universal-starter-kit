import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import TestModule from './components/TestModule';
import TestModuleEdit from './containers/TestModuleEdit';
import resolvers from './resolvers';

import Feature from '../connector';

export default new Feature({
  route: [
    <Route
      exact
      path="/testModule"
      render={props => <TestModule title="Test Module" link="testModule" {...props} />}
    />,
    <Route
      exact
      path="/testModule/:id"
      render={props => <TestModuleEdit title="Test Module" link="testModule" {...props} />}
    />
  ],
  navItem: (
    <MenuItem key="/testModule">
      <NavLink to="/testModule" className="nav-link" activeClassName="active">
        Test Module
      </NavLink>
    </MenuItem>
  ),
  resolver: resolvers
});
