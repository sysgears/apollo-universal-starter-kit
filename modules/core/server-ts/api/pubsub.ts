import { wrapPubSub } from 'apollo-logger';
import { PubSub } from 'graphql-subscriptions';
import { log, settings } from '@gqlapp/core-common';

const pubsub = settings.app.logging.apolloLogging
  ? wrapPubSub(new PubSub(), { logger: log.debug.bind(log) })
  : new PubSub();

export default pubsub as PubSub;
