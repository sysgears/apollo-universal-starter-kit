import React from 'react';

import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import loadable from '@loadable/component';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';
import resources from './locales';

const NavLinkWithI18n = translate('$module$')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/$module$" className="nav-link" activeClassName="active">
    {t('$module$:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [<Route exact path="/$module$" component={loadable(() => import('./containers/$Module$').then(c => c.default))} />],
  navItem: [
    <MenuItem key="/$module$">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: '$module$', resources }]
});
