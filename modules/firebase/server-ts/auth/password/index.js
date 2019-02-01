import schema from './schema.graphql';
import resolvers from './resolvers';
import AuthModule from '../AuthModule';

export default new AuthModule({
  schema: [schema],
  createResolversFunc: [resolvers]
});
