import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import $Module$ from './components/$Module$';
import $Module$Edit from './containers/$Module$Edit';
import resolvers from './resolvers';

import Feature from '../connector';

export default new Feature({
  route: [
    <Route exact path="/$module$" render={props => <$Module$ title="$MoDuLe$" link="$module$" {...props} />} />,
    <Route exact path="/$module$/:id" render={props => <$Module$Edit title="$MoDuLe$" link="$module$" {...props} />} />
  ],
  navItem: (
    <MenuItem key="/$module$">
      <NavLink to="/$module$" className="nav-link" activeClassName="active">
        $MoDuLe$
      </NavLink>
    </MenuItem>
  ),
  resolver: resolvers
});
