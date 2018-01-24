import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import $Module$ from './components/$Module$';
import $Module$Edit from './containers/$Module$Edit';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: [
    <Route exact path="/$module$" component={$Module$} />,
    <Route exact path="/$module$/:id" component={$Module$Edit} />
  ],
  navItem: (
    <MenuItem key="$module$">
      <NavLink to="/$module$" className="nav-link" activeClassName="active">
        $MoDuLe$
      </NavLink>
    </MenuItem>
  ),
  reducer: { $module$: reducers }
});
