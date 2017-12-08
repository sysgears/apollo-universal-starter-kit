import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';

import Chat from './containers/Chat';
import ChatEdit from './containers/ChatEdit';

import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: [<Route exact path="/chats" component={Chat} />, <Route exact path="/chat/:id" component={ChatEdit} />],
  navItem: (
    <MenuItem key="/chats">
      <NavLink to="/chats" className="nav-link" activeClassName="active">
        Chats
      </NavLink>
    </MenuItem>
  ),
  reducer: { chat: reducers }
});
