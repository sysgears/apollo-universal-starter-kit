import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { translate, TranslateFunction } from '@module/i18n-client-react';
import { MenuItem } from '@module/look-client-react';
import ClientModule from '@module/module-client-react';

import reports from './reports';
import Report from './containers/Report';
import resources from './locales';

const NavLinkWithI18n = translate('report')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/report" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

export default new ClientModule(reports, {
  route: [<Route exact path="/report" component={Report} />],
  navItem: [
    <MenuItem key="/report">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'report', resources }]
});
