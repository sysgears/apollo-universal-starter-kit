import rootSchemaDef from './rootSchema.graphqls';
import modules from '../modules';

const schema = {
  typeDefs: [rootSchemaDef].concat(modules.schemas),
  resolvers: modules.createResolvers()
};

export default schema;
