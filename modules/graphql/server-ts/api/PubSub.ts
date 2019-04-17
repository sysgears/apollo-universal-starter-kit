import { wrapPubSub } from 'apollo-logger';
import { PubSub } from 'graphql-subscriptions';
import { log } from '@gqlapp/core-common';

import settings from '../../../../settings';

const { apolloLogging } = settings.app.logging;

const pubSub = apolloLogging ? wrapPubSub(new PubSub(), { logger: log.debug.bind(log) }) : new PubSub();

export default pubSub as PubSub;
