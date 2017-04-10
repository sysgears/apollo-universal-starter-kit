import React from 'react';
import { Route, Link } from 'react-router-dom';
import { NavItem } from 'reactstrap';

import PostList from './containers/post_list';
import PostAdd from './containers/post_add';
import PostEdit from './containers/post_edit';

import reducers from './reducers';

export const getReducers = () => ({ post: reducers });

export const getNavItems = () => [
  (<NavItem>
    <Link to="/posts" className="nav-link">Posts</Link>
  </NavItem>)
];

export const getRoutes = () => [
  (<Route exact path="/posts" component={PostList} />),
  (<Route exact path="/post/add" component={PostAdd} />),
  (<Route exact path="/post/:id" component={PostEdit} />)
];