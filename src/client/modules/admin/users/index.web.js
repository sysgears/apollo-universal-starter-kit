import Feature from '../connector';

import UsersMain from './containers/Main';

export default new Feature({
  sideNavItem: 'users',
  viewComponent: UsersMain
});
