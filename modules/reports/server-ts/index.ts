import ServerModule from '@module/module-server-ts';

import Report from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import resources from './locales';
import pdf from './pdf';
import excel from './excel';

export default new ServerModule(pdf, excel, {
  schema: [schema],
  createResolversFunc: [createResolvers],
  createContextFunc: [() => ({ Report: new Report() })],
  localization: [{ ns: 'reports', resources }]
});
