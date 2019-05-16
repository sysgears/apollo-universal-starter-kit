import ServerModule from '@gqlapp/module-server-ts';
import Report from '../sql';
import schema from './schema';
import resolvers from './resolvers';

export default new ServerModule({
  schema: [schema],
  createResolversFunc: [resolvers],
  createContextFunc: [() => ({ Report: new Report() })]
});
