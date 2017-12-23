import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../plugins/common/components/web';

import Post from './containers/Post';
import PostEdit from './containers/PostEdit';

import reducers from './reducers';

import Plugin from '../plugin';

export default new Plugin({
  route: [<Route exact path="/posts" component={Post} />, <Route exact path="/post/:id" component={PostEdit} />],
  navItem: (
    <MenuItem key="/posts">
      <NavLink to="/posts" className="nav-link" activeClassName="active">
        Posts
      </NavLink>
    </MenuItem>
  ),
  reducer: { post: reducers }
});
