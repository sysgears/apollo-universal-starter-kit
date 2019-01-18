import ServerModule from '@module/module-server-ts';

import Report from './sql';
import schema from './schema.graphql';
import createResolvers from './resolvers';
import pdfResolvers from './generateFile/pdf/resolvers';
import excelResolvers from './generateFile/excel/resolvers';
import resources from './locales';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [createResolvers, pdfResolvers, excelResolvers],
  createContextFunc: [() => ({ Report: new Report() })],
  localization: [{ ns: 'reports', resources }]
});
