import Feature from '../connector';

import GroupsMain from './containers/Main';

export default new Feature({
  sideNavItem: 'groups',
  viewComponent: GroupsMain
});
