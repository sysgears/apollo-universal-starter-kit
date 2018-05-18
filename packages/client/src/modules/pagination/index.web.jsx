import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import translate from '../../i18n';

import { MenuItem } from '../../modules/common/components/web';
import PaginationContainer from './containers/PaginationContainer';
import resources from './locales';
import Feature from '../connector';

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/pagination" className="nav-link" activeClassName="active">
    {t('pagination:navLink')}
  </NavLink>
));

export default new Feature({
  route: [<Route exact path="/pagination" component={PaginationContainer} />],
  navItem: (
    <MenuItem key="/pagination">
      <NavLinkWithI18n />
    </MenuItem>
  ),
  localization: { ns: 'pagination', resources }
});
