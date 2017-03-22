import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Counter from './ui/containers/counter'
import PostList from './ui/containers/post_list'
import App from './ui/components/app'

export default (
  <App>
    <Switch>
      <Route exact path="/" component={Counter} />
      <Route exact path="/posts" component={PostList} />
    </Switch>
  </App>
);
