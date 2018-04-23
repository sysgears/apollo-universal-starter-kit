import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import { createApolloFetch } from 'apollo-fetch';
import { constructUploadOptions } from 'apollo-fetch-upload';

import translate from '../../i18n';
import { MenuItem } from '../../modules/common/components/web';
import Upload from './containers/Upload';
import reducers from './reducers';
import resources from './locales';

import Feature from '../connector';

const MenuItemWithI18n = translate('upload')(({ t }) => (
  <MenuItem key="/upload">
    <NavLink to="/upload" className="nav-link" activeClassName="active">
      {t('navLink')}
    </NavLink>
  </MenuItem>
));

export default new Feature({
  data: { upload: true },
  route: <Route exact path="/upload" component={Upload} />,
  navItem: <MenuItemWithI18n />,
  reducer: { upload: reducers },
  localization: { ns: 'upload', resources },
  createFetch: uri =>
    createApolloFetch({
      uri,
      constructOptions: (reqs, options) => ({
        ...constructUploadOptions(reqs, options),
        credentials: 'include'
      })
    })
});
