import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import $Plugin$ from './containers/$Plugin$';
import reducers from './reducers';

import Plugin from '../plugin';

export default new Plugin({
  route: <Route exact path="/$module$" component={$Plugin$} />,
  navItem: (
    <MenuItem key="$module$">
      <NavLink to="/$module$" className="nav-link" activeClassName="active">
        $Plugin$
      </NavLink>
    </MenuItem>
  ),
  reducer: { $module$: reducers }
});
