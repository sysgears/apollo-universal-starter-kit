import { GraphQLModule } from '@gqlapp/graphql-server-ts';

import ContactsDAO from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';
import pdf from './pdf';
import excel from './excel';

export default new GraphQLModule(pdf, excel, {
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Contacts: new ContactsDAO() })],
  localization: [{ ns: 'reports', resources }]
});
