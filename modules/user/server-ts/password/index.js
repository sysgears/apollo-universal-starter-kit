import { AuthModule } from '@gqlapp/authentication-server-ts';
import schema from './schema.graphql';
import resolvers from './resolvers';
import settings from '../../../../settings';
import restApi from './controllers';

export default (settings.auth.password.enabled
  ? new AuthModule({ schema: [schema], createResolversFunc: [resolvers], restApi })
  : undefined);
