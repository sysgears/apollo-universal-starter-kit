import ServerModule from '@gqlapp/module-server-ts';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  localization: [{ ns: 'contact', resources }]
});
