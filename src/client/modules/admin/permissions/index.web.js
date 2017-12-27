import Feature from '../connector';

import PermissionsMain from './containers/Main';

export default new Feature({
  sideNavItem: 'permissions',
  viewComponent: PermissionsMain
});
