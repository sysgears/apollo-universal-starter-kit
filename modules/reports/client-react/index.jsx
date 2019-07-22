import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { translate } from '@gqlapp/i18n-client-react';
import { MenuItem } from '@gqlapp/look-client-react';
import ClientModule from '@gqlapp/module-client-react';
import loadable from '@loadable/component';

import reports from './reports';
import resources from './locales';

const NavLinkWithI18n = translate('report')(({ t }) => (
  <NavLink to="/report" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

export default new ClientModule(reports, {
  route: [
    <Route exact path="/report" component={loadable(() => import('./containers/Report').then(c => c.default))} />
  ],
  navItem: [
    <MenuItem key="/report">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'report', resources }]
});
