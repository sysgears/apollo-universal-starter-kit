import authentication from './authentication/';
import authorization from './authorization/';

import org from './org';
import group from './group';
import user from './user';
import sa from './sa';

import subscription from './subscription';

import counter from './counter';
import post from './post';
import upload from './upload';
import contact from './contact';
import mailer from './mailer';
import graphqlTypes from './graphqlTypes';
import apolloEngine from './apolloEngine';

import './debug';

import Feature from './connector';

import settings from '../../../settings';

const config = settings.entities;

// On by default features
let features = [graphqlTypes, mailer, counter, contact, post, upload];

// Configurable features
if (config.users.enabled) {
  features.push(user);
  features.push(authentication);
  features.push(authorization);
}

if (config.groups.enabled) {
  features.push(group);
}

if (config.orgs.enabled) {
  features.push(org);
}

if (config.serviceaccounts.enabled) {
  features.push(sa);
}

if (settings.subscription.enabled) {
  features.push(subscription);
}

if (settings.engine.enabled) {
  features.push(apolloEngine);
}

export default new Feature(...features);
