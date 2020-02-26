import React from 'react';
import ClientModule from '@gqlapp/module-client-react';
import { translate, TranslateFunction } from '@gqlapp/i18n-client-react';
import { NavLink } from 'react-router-dom';
import { MenuItem } from '@gqlapp/look-client-react';

import $Module$ from './components/$Module$';
import $Module$Edit from './containers/$Module$Edit';
import resolvers from './resolvers';
import resources from './locales';

const { AuthRoute, IfLoggedIn } = require('@gqlapp/user-client-react');

const NavLinkWithI18n = translate('$module$')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/$module$" className="nav-link" activeClassName="active">
    {t('$module$:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [
    <AuthRoute
      exact
      path="/$module$"
      component={$Module$}
      role={['editor', 'admin']}
      title="$MoDuLe$"
      link="$module$"
    />,
    <AuthRoute
      exact
      path="/$module$/:id"
      component={$Module$Edit}
      role={['editor', 'admin']}
      title="$MoDuLe$"
      link="$module$"
    />
  ],
  navItem: [
    <IfLoggedIn role={['editor', 'admin']}>
      <MenuItem key="/$module$">
        <NavLinkWithI18n />
      </MenuItem>
    </IfLoggedIn>
  ],
  resolver: [resolvers],
  localization: [{ ns: '$module$', resources }]
});
