import React from 'react';
import { NavLink } from 'react-router-dom';

import translate, { TranslateFunction } from '../../../../i18n';
import { MenuItem } from '../../../../modules/common/components/web';
import * as user from '../../../user/index.web';
import settings from '../../../../../../../settings';
import Feature from '../../../connector';

import { SubscriptionAuthRouter } from './containers/Auth';
import resources from './locales';
import AddSubscription from './containers/AddSubscription';
import SubscriberPage from './containers/SubscriberPage';
import UpdateCreditCard from './containers/UpdateCreditCard';

const { AuthRoute, IfLoggedIn }: any = user;

const NavLinkWithI18n = translate('subscription')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/subscribers-only" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

const Loader = () => <span>Loading...</span>; // TODO: internationalisation

export default new Feature(
  settings.payments.stripe.recurring.enabled
    ? {
        route: [
          <AuthRoute exact role="user" path="/subscription" component={AddSubscription} />,
          <AuthRoute
            exact
            role="user"
            path="/subscribers-only"
            component={(props: any) => <SubscriptionAuthRouter {...props} loader={Loader} component={SubscriberPage} />}
          />,
          <AuthRoute
            exact
            role="user"
            path="/update-card"
            component={(props: any) => (
              <SubscriptionAuthRouter {...props} loader={Loader} component={UpdateCreditCard} />
            )}
          />
        ],
        navItem: (
          <IfLoggedIn role="user">
            <MenuItem key="/subscribers-only">
              <NavLinkWithI18n />
            </MenuItem>
          </IfLoggedIn>
        ),
        scriptsInsert: settings.payments.stripe.recurring.secretKey ? 'https://js.stripe.com/v3/' : undefined,
        localization: { ns: 'subscription', resources }
      }
    : {}
);
