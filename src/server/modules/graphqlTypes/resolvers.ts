/*eslint-disable no-unused-vars*/
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

export default (pubsub: any) => ({
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime
});
