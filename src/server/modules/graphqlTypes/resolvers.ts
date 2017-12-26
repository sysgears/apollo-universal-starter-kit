/*eslint-disable no-unused-vars*/
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

export const createResolvers = (pubsub: any) => ({
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime
});
