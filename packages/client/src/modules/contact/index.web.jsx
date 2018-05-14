import React from 'react';
import { Route, NavLink } from 'react-router-dom';

import translate from '../../i18n';
import { MenuItem } from '../../modules/common/components/web';
import Contact from './containers/Contact';
import resources from './locales';
import Feature from '../connector';

const NavLinkWithI18n = translate('contact')(({ t }) => (
  <NavLink to="/contact" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));
export default new Feature({
  route: <Route exact path="/contact" component={Contact} />,
  navItem: (
    <MenuItem key="/contact">
      <NavLinkWithI18n />
    </MenuItem>
  ),
  localization: { ns: 'contact', resources }
});
