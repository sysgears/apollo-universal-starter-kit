import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Counter from './ui/containers/counter'
import PostList from './ui/containers/post_list'
import PostAdd from './ui/containers/post_add'
import PostEdit from './ui/containers/post_edit'
import App from './ui/components/app'

export default (
  <App>
    <Switch>
      <Route exact path="/" component={Counter} />
      <Route exact path="/posts" component={PostList} />
      <Route exact path="/post/add" component={PostAdd} />
      <Route exact path="/post/:id" component={PostEdit} />
    </Switch>
  </App>
);
