import { apolloEngineModule } from './apolloEngine';
import { counterModule } from './counter';
import './debug';
import { graphqlTypesModule } from './graphqlTypes';
import { mailerModule } from './mailer';
import { postModule } from './post';
import { uploadModule } from './upload';
import { userModule } from './user';

import { Feature } from './connector';

// export default new Feature(counter, post, upload, user, mailer, graphqlTypes, apolloEngine);
export const modules = new Feature(
  counterModule,
  postModule,
  uploadModule,
  userModule,
  mailerModule,
  graphqlTypesModule,
  apolloEngineModule
);
