import ServerModule from '@module/module-server-ts';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';

export * from './contactFormSchema';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers],
  localization: [{ ns: 'contact', resources }]
});
