import Feature from '../connector';

import orgs from './orgs';
import groups from './groups';
import users from './users';
import serviceaccounts from './serviceaccounts';

import settings from '../../../../settings';

const config = settings.entities;

let subfeatures = [];

if (config.orgs.enabled) {
  subfeatures.push(orgs);
}

if (config.groups.enabled) {
  subfeatures.push(groups);
}

if (config.users.enabled) {
  subfeatures.push(users);
}

if (config.serviceaccounts.enabled) {
  subfeatures.push(serviceaccounts);
}

export default new Feature(...subfeatures);
