import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../plugins/common/components/web';
import $Module$ from './containers/$Module$';
import reducers from './reducers';

import Plugin from '../plugin';

export default new Plugin({
  route: <Route exact path="/$plugin$" component={$Module$} />,
  navItem: (
    <MenuItem key="$plugin$">
      <NavLink to="/$plugin$" className="nav-link" activeClassName="active">
        $Module$
      </NavLink>
    </MenuItem>
  ),
  reducer: { $plugin$: reducers }
});
