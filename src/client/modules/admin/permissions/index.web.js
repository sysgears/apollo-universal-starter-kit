import Feature from '../connector';

import PermissionsList from './containers/List';

export default new Feature({
  sideNavItem: 'permissions',
  viewComponent: PermissionsList
});
