import entities from './entities';
import auth from './auth';
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

// On by default features
let features = [graphqlTypes, mailer, auth, entities, counter, contact, post, upload];

// Configurable features
if (settings.subscription.enabled) {
  features.push(subscription);
}

if (settings.engine.enabled) {
  features.push(apolloEngine);
}

export default new Feature(...features);
