import React from 'react';
import { Route, NavLink } from 'react-router-dom';

import { translate, TranslateFunction } from '@module/i18n-client-react';
import { MenuItem } from '../../../packages/client/src/modules/common/components/web';
import Contact from './containers/Contact';
import resources from './locales';
import ClientModule from '@module/module-client-react';

const NavLinkWithI18n = translate('contact')(({ t }: { t: TranslateFunction }) => (
  <NavLink to="/contact" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [<Route exact path="/contact" component={Contact} />],
  navItem: [
    <MenuItem key="/contact">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'contact', resources }]
});
