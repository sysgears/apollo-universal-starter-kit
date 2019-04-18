import { GraphQLModule } from '@gqlapp/graphql-server-ts';

import mailer from './mailer';

export { mailer };

export default new GraphQLModule({
  createContextFunc: [() => ({ mailer })]
});
