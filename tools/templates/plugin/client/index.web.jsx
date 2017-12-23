import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import $Module$ from './containers/$Module$';
import reducers from './reducers';

import Plugin from '../connector';

export default new Plugin({
  route: <Route exact path="/$module$" component={$Module$} />,
  navItem: (
    <MenuItem key="$module$">
      <NavLink to="/$module$" className="nav-link" activeClassName="active">
        $Module$
      </NavLink>
    </MenuItem>
  ),
  reducer: { $module$: reducers }
});
