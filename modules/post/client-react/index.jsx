import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { translate } from '@gqlapp/i18n-client-react';
import { MenuItem } from '@gqlapp/look-client-react';
import ClientModule from '@gqlapp/module-client-react';
import loadable from '@loadable/component';

import resources from './locales';
import resolvers from './resolvers';

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/posts" className="nav-link" activeClassName="active">
    {t('post:navLink')}
  </NavLink>
));

export default new ClientModule({
  route: [
    <Route exact path="/posts" component={loadable(() => import('./containers/Post').then(c => c.default))} />,
    <Route exact path="/post/new" component={loadable(() => import('./containers/PostAdd').then(c => c.default))} />,
    <Route path="/post/:id" component={loadable(() => import('./containers/PostEdit').then(c => c.default))} />
  ],
  navItem: [
    <MenuItem key="/posts">
      <NavLinkWithI18n />
    </MenuItem>
  ],
  resolver: [resolvers],
  localization: [{ ns: 'post', resources }]
});
