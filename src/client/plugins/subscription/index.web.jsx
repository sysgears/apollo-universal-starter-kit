import React from 'react';
import { Route, NavLink } from 'react-router-dom';

import { MenuItem } from '../../plugins/common/components/web';
import Subscription from './containers/Subscription';
import SubscribersOnly from './containers/SubscribersOnly';
import UpdateCard from './containers/UpdateCard';
import { SubscriberRoute } from './containers/Auth';
import reducers from './reducers';

import Plugin from '../plugin';

export default new Plugin({
  route: [
    <Route exact path="/subscription" component={Subscription} />,
    <SubscriberRoute exact scope="user" path="/subscribers-only" component={SubscribersOnly} />,
    <SubscriberRoute exact scope="user" path="/update-card" component={UpdateCard} />
  ],
  navItem: [
    <MenuItem key="/subscribers-only">
      <NavLink to="/subscribers-only" className="nav-link" activeClassName="active">
        Subscribers Only
      </NavLink>
    </MenuItem>
  ],
  reducer: { subscription: reducers },
  scriptsInsert: 'https://js.stripe.com/v3/'
});
