import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import ClientModule from '@module/module-client-react';
import { translate } from '@module/i18n-client-react';
import { MenuItem } from '@module/look-client-react';

import Chat from './containers/ChatOperations';
import resources from './locales';

const NavLinkWithI18n = translate('chat')(({ t }: any) => (
  <NavLink to="/chat" className="nav-link" activeClassName="active">
    {t('navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [<Route exact path="/chat" component={Chat} />],
  navItem: [
    <MenuItem key="/chat">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  localization: [{ ns: 'chat', resources }]
});
