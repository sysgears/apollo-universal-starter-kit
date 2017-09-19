import React from 'react';
import { Route, Link } from 'react-router-dom';
import { NavItem } from 'reactstrap';

import Post from './containers/Post';
import PostEdit from './containers/PostEdit';

import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: [
    <Route exact path="/posts" component={Post} />,
    <Route exact path="/post/:id" component={PostEdit} />
  ],
  navItem: (
    <NavItem>
      <Link to="/posts" className="nav-link">
        Posts
      </Link>
    </NavItem>
  ),
  reducer: { post: reducers }
});
