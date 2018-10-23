import React from 'react';
import { Route, NavLink } from 'react-router-dom';

import createNetLink from './netLink';
import translate from '../../i18n';
import { MenuItem } from '../../modules/common/components/web';
import Upload from './containers/Upload';
import resources from './locales';

import ClientModule from '../ClientModule';

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
