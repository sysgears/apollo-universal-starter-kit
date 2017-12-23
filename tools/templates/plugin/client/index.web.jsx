import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../plugins/common/components/web';
import $Plugin$ from './containers/$Plugin$';
import reducers from './reducers';

import Plugin from '../plugin';

export default new Plugin({
  route: <Route exact path="/$plugin$" component={$Plugin$} />,
  navItem: (
    <MenuItem key="$plugin$">
      <NavLink to="/$plugin$" className="nav-link" activeClassName="active">
        $Plugin$
      </NavLink>
    </MenuItem>
  ),
  reducer: { $plugin$: reducers }
});
