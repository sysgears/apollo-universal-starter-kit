import { addApolloLogging } from 'apollo-logger';
import { PubSub } from 'graphql-subscriptions';

import settings from '../../../settings';

const pubsub = settings.apolloLogging ? addApolloLogging(new PubSub()) : new PubSub();

export default pubsub;
