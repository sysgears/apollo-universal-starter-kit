import { GraphQLDate, GraphQLTime, GraphQLDateTime } from 'graphql-iso-date';

export default () => ({
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime
});
