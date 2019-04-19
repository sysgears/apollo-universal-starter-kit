import { GraphQLServerModule } from '@gqlapp/graphql-server-ts';

import mailer from './mailer';

export { mailer };

export default new GraphQLServerModule({
  createContextFunc: [() => ({ mailer })]
});
