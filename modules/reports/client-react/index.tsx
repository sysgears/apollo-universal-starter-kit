import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { translate, TranslateFunction } from '@module/i18n-client-react';
import { MenuItem } from '@module/look-client-react';
import ClientModule from '@module/module-client-react';

import Reports from './containers/Reports';
import resources from './locales';

const NavLinkWithI18n = translate('reports')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/reports" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [<Route exact path="/reports" component={Reports} />],
  navItem: [
    <MenuItem key="/reports">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'reports', resources }]
});
