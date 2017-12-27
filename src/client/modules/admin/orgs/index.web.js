import Feature from '../connector';

import OrgsMain from './containers/Main';

export default new Feature({
  sideNavItem: 'organizations',
  viewComponent: OrgsMain
});
