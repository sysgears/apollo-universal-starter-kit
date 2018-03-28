import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { translate } from 'react-i18next';

import { MenuItem } from '../../modules/common/components/web';
import Contact from './containers/Contact';
import resources from './locales';
import Feature from '../connector';

const MenuItemWithI18n = translate('contact')(({ t }) => (
  <MenuItem key="contact">
    <NavLink to="/contact" className="nav-link" activeClassName="active">
      {t('navLink')}
    </NavLink>
  </MenuItem>
));
export default new Feature({
  route: <Route exact path="/contact" component={Contact} />,
  navItem: <MenuItemWithI18n />,
  localization: { ns: 'contact', resources }
});
