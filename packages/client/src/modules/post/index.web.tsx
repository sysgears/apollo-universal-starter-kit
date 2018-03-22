import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';

import Post from './containers/Post.web';
import PostEdit from './containers/PostEdit.web';

import clientStateParams from './resolvers';

import Feature from '../connector.web';

export default new Feature({
  route: [<Route exact path="/posts" component={Post} />, <Route exact path="/post/:id" component={PostEdit} />],
  navItem: (
    <MenuItem key="/posts">
      <NavLink to="/posts" className="nav-link" activeClassName="active">
        Posts
      </NavLink>
    </MenuItem>
  ),
  clientStateParams
});
