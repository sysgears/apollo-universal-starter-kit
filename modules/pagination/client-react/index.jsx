import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { translate } from '@gqlapp/i18n-client-react';
import { MenuItem } from '@gqlapp/look-client-react';
import ClientModule from '@gqlapp/module-client-react';
import loadable from '@loadable/component';

import resources from './locales';

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/pagination" className="nav-link" activeClassName="active">
    {t('pagination:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [
    <Route
      exact
      path="/pagination"
      component={loadable(() => import('./containers/PaginationDemo').then(c => c.default))}
    />
  ],
  navItem: [
    <MenuItem key="/pagination">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'pagination', resources }]
});
