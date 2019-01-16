import { AuthModule } from '@module/authentication-server-ts';
import schema from './schema.graphql';
import resolvers from './resolvers';
import settings from '../../../../../settings';

export default (settings.user.auth.password.enabled
  ? new AuthModule({ schema: [schema], createResolversFunc: [resolvers] })
  : undefined);
