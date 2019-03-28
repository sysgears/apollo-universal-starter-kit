import { AuthModule } from '@gqlapp/authentication-server-ts';
import settings from '@gqlapp/settings-common';

import schema from './schema.graphql';
import resolvers from './resolvers';

export default (settings.auth.password.enabled
  ? new AuthModule({ schema: [schema], createResolversFunc: [resolvers] })
  : undefined);
