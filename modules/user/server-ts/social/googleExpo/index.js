import { AuthModule } from '@gqlapp/authentication-server-ts';
import settings from '@gqlapp/config';

import schema from './schema';
import resolvers from './resolvers';

const isExpo = settings.auth.social.google.enabled && settings.auth.social.google.mobileType === 'expo';

export default (isExpo && !__TEST__
  ? new AuthModule({ schema: [schema], createResolversFunc: [resolvers] })
  : undefined);
