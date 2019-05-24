import { AuthModule } from '@gqlapp/authentication-server-ts';
import settings from '@gqlapp/config';

import schema from './schema';
import resolvers from './resolvers';

const enabled = settings.auth.social.facebook.enabled;

export default (enabled && !__TEST__
  ? new AuthModule({ schema: [schema], createResolversFunc: [resolvers] })
  : undefined);
