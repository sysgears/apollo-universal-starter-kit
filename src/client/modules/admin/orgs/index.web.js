import Feature from '../connector';

import OrgsList from './containers/List';

export default new Feature({
  sideNavItem: 'organizations',
  viewComponent: OrgsList
});
