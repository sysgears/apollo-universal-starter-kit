import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
import $Module$List from './containers/$Module$List';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact path="/$module$" component={$Module$List} />,
  navItem: (
    <MenuItem key="$module$">
      <NavLink to="/$module$" className="nav-link" activeClassName="active">
        $Module$
      </NavLink>
    </MenuItem>
  ),
  reducer: { $module$: reducers }
});
