import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import translate from '../../i18n';

import { MenuItem } from '../../modules/common/components/web';
import Post from './containers/Post';
import PostEdit from './containers/PostEdit';
import PostAdd from './containers/PostAdd';
import resources from './locales';
import resolvers from './resolvers';
import Feature from '../connector';

const NavLinkWithI18n = translate()(({ t }) => (
  <NavLink to="/posts" className="nav-link" activeClassName="active">
    {t('post:navLink')}
  </NavLink>
));

export default new Feature({
  route: [
    <Route exact path="/posts" component={Post} />,
    <Route exact path="/post/new" component={PostAdd} />,
    <Route path="/post/:id" component={PostEdit} />
  ],
  navItem: (
    <MenuItem key="/posts">
      <NavLinkWithI18n />
    </MenuItem>
  ),
  resolver: resolvers,
  localization: { ns: 'post', resources }
});
