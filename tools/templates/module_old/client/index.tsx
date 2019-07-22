import React from 'react';
import loadable from '@loadable/component';

import ClientModule from '../ClientModule';
import translate, { TranslateFunction } from '../../i18n';

import { Route, NavLink } from 'react-router-dom';
import { MenuItem } from '../../modules/common/components/web';
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
