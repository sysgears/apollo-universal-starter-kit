import { ServerRestModule } from '@gqlapp/module-server-ts';
import schema from './schema.graphql';
import resolvers from './resolvers';
import settings from '../../../../settings';
import restApi from './controllers';

export default (settings.auth.password.enabled
  ? new ServerRestModule({ schema: [schema], createResolversFunc: [resolvers], restApi })
  : undefined);
