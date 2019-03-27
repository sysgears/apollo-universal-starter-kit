import ServerModule from '@gqlapp/module-server-ts';

import ContactsDAO from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';
import pdf from './pdf';
import excel from './excel';

export default new ServerModule(pdf, excel, {
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Contacts: new ContactsDAO() })],
  getApi: [{ route: '/test', controller: (req, res) => res.send('here we go with GET') }],
  postApi: [{ route: '/postTest', controller: (req, res) => res.send('you reached POST route, good for you') }],
  localization: [{ ns: 'reports', resources }]
});
