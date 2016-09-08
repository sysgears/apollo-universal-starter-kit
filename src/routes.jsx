import React from 'react'
import { Route, IndexRedirect } from 'react-router'

import Counter from './ui/containers/counter'
import App from './ui/components/app'

export default (
  <Route path="/" component={App}>
    <IndexRedirect to="/counter" />
    <Route path="counter" component={Counter} />
  </Route>
);
