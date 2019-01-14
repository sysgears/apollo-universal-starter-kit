import schema from './schema.graphql';
import resolvers from './resolvers';
import resolversFirebase from './resolvers.firebase';
import AuthModule from '../AuthModule';
import settings from '../../../../../settings';

export default (settings.user.auth.password.enabled
  ? new AuthModule({
      schema: [schema],
      createResolversFunc: settings.user.auth.firebase.enabled ? [resolversFirebase] : [resolvers]
    })
  : undefined);
