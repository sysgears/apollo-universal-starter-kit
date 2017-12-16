import Feature from '../connector';

import settings from '../../../../settings';

import org from './org';
import group from './group';
import user from './user';
import sa from './sa';

const config = settings.entities;

let features = [];

if (config.enabled) {
  console.log('Features - adding - Entities');

  if (config.orgs.enabled) {
    console.log('Features - adding - Orgs');
    features.push(org);
  }

  if (config.groups.enabled) {
    console.log('Features - adding - Groups');
    features.push(group);
  }

  if (config.users.enabled) {
    console.log('Features - adding - Users');
    features.push(user);
  }

  if (config.serviceaccounts.enabled) {
    console.log('Features - adding - ServiceAccounts');
    features.push(sa);
  }
}

export default new Feature(...features);
