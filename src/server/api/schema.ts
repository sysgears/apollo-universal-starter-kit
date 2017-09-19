import { makeExecutableSchema, addErrorLoggingToSchema } from "graphql-tools";
import { PubSub } from "graphql-subscriptions";

import * as rootSchemaDef from "./rootSchema.graphqls";
import modules from "../modules";
import log from "../../common/log";
import settings from "../../../settings";

const addApolloLogging = require("apollo-logger");

export const pubsub = settings.apolloLogging
  ? addApolloLogging(new PubSub())
  : new PubSub();

const executableSchema = makeExecutableSchema({
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers(pubsub)
});

addErrorLoggingToSchema(executableSchema, { log: e => log.error(e) });

export default executableSchema;
