import React from 'react';
import { NavLink } from 'react-router-dom';

import translate, { TranslateFunction } from '../../../../i18n';
import { MenuItem } from '../../../../modules/common/components/web';
import * as user from '../../../user';
import settings from '../../../../../../../settings';
import ClientModule from '../../../ClientModule';

import SubscriptionAuthRouter from './containers/Auth';
import resources from './locales';
import AddSubscription from './containers/AddSubscription';
import SubscriberPage from './containers/SubscriberPage';
import UpdateCreditCard from './containers/UpdateCreditCard';

const { AuthRoute, IfLoggedIn }: any = user;

const NavLinkWithI18n = translate('stripeSubscription')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/subscriber-page" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

export default (settings.stripe.subscription.enabled && settings.stripe.subscription.publicKey
  ? new ClientModule({
      route: [
        <AuthRoute exact role="user" path="/add-subscription" component={AddSubscription} />,
        <AuthRoute
          exact
          role="user"
          path="/subscriber-page"
          component={(props: any) => <SubscriptionAuthRouter {...props} component={SubscriberPage} />}
        />,
        <AuthRoute
          exact
          role="user"
          path="/update-credit-card"
          component={(props: any) => <SubscriptionAuthRouter {...props} component={UpdateCreditCard} />}
        />
      ],
      navItem: [
        <IfLoggedIn role="user">
          <MenuItem key="/subscriber-page">
            <NavLinkWithI18n />
          </MenuItem>
        </IfLoggedIn>
      ],
      scriptsInsert: ['https://js.stripe.com/v3/'],
      localization: [{ ns: 'stripeSubscription', resources }]
    })
  : undefined);
