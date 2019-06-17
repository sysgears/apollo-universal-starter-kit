import ServerModule from '@gqlapp/module-server-ts';
import Report from '../sql';
import schema from './schema.graphql';
import resolvers from './resolvers';
import resources from './locales';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [resolvers],
  createContextFunc: [() => ({ Report: new Report() })],
  localization: [{ ns: 'PdfReport', resources }]
});
