import React from 'react';
import { NavLink } from 'react-router-dom';
import loadable from '@loadable/component';

import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { MenuItem } from '@gqlapp/look-client-react';
import ClientModule from '@gqlapp/module-client-react';
import settings from '@gqlapp/config';

import resources from './locales';

const { AuthRoute, IfLoggedIn } = require('@gqlapp/user-client-react');

const SubscriptionAuthRouter = loadable(() => import('./containers/Auth').then(c => c.default));

const NavLinkWithI18n = translate('stripeSubscription')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/subscriber-page" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

export default settings.stripe.subscription.enabled && settings.stripe.subscription.publicKey
  ? new ClientModule({
      route: [
        <AuthRoute
          exact
          role="user"
          path="/add-subscription"
          component={loadable(() => import('./containers/AddSubscription').then(c => c.default))}
        />,
        <AuthRoute
          exact
          role="user"
          path="/subscriber-page"
          component={(props: any) => (
            <SubscriptionAuthRouter
              {...props}
              component={loadable(() => import('./containers/SubscriberPage').then(c => c.default))}
            />
          )}
        />,
        <AuthRoute
          exact
          role="user"
          path="/update-credit-card"
          component={(props: any) => (
            <SubscriptionAuthRouter
              {...props}
              component={loadable(() => import('./containers/UpdateCreditCard').then(c => c.default))}
            />
          )}
        />
      ],
      navItem: [
        <IfLoggedIn role="user">
          <MenuItem key="/subscriber-page">
            <NavLinkWithI18n />
          </MenuItem>
        </IfLoggedIn>
      ],
      localization: [{ ns: 'stripeSubscription', resources }]
    })
  : undefined;
