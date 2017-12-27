import Feature from '../connector';

import GroupsList from './containers/List';

export default new Feature({
  sideNavItem: 'groups',
  viewComponent: GroupsList
});
