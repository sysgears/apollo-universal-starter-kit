import Main from './main';
import Permissions from './permissions';
import Users from './users';
import Groups from './groups';
import Orgs from './orgs';

import ClientFeature from '../connector';
import AdminFeature from './connector';

// import settings from '../../../../settings';

// const entities = settings.entities;

// On by default features
let features = [Main, Permissions, Users, Groups, Orgs];
console.log('FEATURES', features);

export const Admin = new AdminFeature(...features);

console.log('POST', Admin.viewComponents);

export default new ClientFeature(...features);
