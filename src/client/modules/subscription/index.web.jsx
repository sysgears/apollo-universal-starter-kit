import React from 'react';
import { Route, NavLink } from 'react-router-dom';

import { MenuItem } from '../../modules/common/components/web';
import Subscription from './containers/Subscription';
import SubscribersOnly from './containers/SubscribersOnly';
import UpdateCard from './containers/UpdateCard';
import { SubscriberRoute } from './containers/Auth';
import reducers from './reducers';
import settings from '../../../../settings';

import Feature from '../connector';

export default new Feature({
  route: settings.subscription.enabled
    ? [
        <Route exact path="/subscription" component={Subscription} />,
        <SubscriberRoute exact scope="user" path="/subscribers-only" component={SubscribersOnly} />,
        <SubscriberRoute exact scope="user" path="/update-card" component={UpdateCard} />
      ]
    : [],
  navItem: settings.subscription.enabled
    ? [
        <MenuItem key="/subscribers-only">
          <NavLink to="/subscribers-only" className="nav-link" activeClassName="active">
            Subscribers Only
          </NavLink>
        </MenuItem>
      ]
    : [],
  reducer: { subscription: reducers },
  scriptsInsert: 'https://js.stripe.com/v3/'
});
