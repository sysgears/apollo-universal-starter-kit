import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import ClientModule from '@module/module-client-react';
import { translate } from '@module/i18n-client-react';
import { MenuItem } from '@module/look-client-react';

import createNetLink from './netLink';
import Upload from './containers/Upload';
import resources from './locales';

const NavLinkWithI18n = translate('upload')(({ t }) => (
  <NavLink to="/upload" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

export default new ClientModule({
  data: { upload: true },
  route: [<Route exact path="/upload" component={Upload} />],
  navItem: [
    <MenuItem key="/upload">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'upload', resources }],
  createNetLink
});
