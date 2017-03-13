import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Counter from './ui/containers/counter'
import App from './ui/components/app'

export default (
  <App>
    <Switch>
      <Route exact path="/" component={Counter} />
    </Switch>
  </App>
);
