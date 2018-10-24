const { resolve } = require('path');
const { makeExecutableSchema } = require('graphql-tools');
const { loadSchemaFiles } = require('@graphql-modules/sonar');

const typeDefs = loadSchemaFiles(resolve(__dirname, '../'), {
  extensions: ['graphql'],
  useRequire: false
});

const schema = makeExecutableSchema({
  typeDefs
});

module.exports = schema;
