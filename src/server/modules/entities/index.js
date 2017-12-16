import Feature from '../connector';

import settings from '../../../../settings';

import org from './org';
import group from './group';
import user from './user';
import sa from './sa';

const config = settings.entities;

let subfeatures = [];

if (config.orgs.enabled) {
  subfeatures.push(org);
}

if (config.groups.enabled) {
  subfeatures.push(group);
}

if (config.users.enabled) {
  subfeatures.push(user);
}

if (config.serviceaccounts.enabled) {
  subfeatures.push(sa);
}

export default new Feature(...subfeatures);
