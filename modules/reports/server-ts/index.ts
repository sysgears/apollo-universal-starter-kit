import ServerModule from '@gqlapp/module-server-ts';

import ContactsDAO from './sql';
import schema from './schema';
import createResolvers from './resolvers';
import resources from './locales';
import pdf from './pdf';
import excel from './excel';

export default new ServerModule(pdf, excel, {
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Contacts: new ContactsDAO() })],
  localization: [{ ns: 'reports', resources }]
});
