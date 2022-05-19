import { initRenderer } from '@gqlapp/testing-client-react';
import rootSchema from '@gqlapp/core-server-ts/api/rootSchema.graphql';

import serverModules from 'server/src/modules';
import clientModules from '..';

initRenderer([rootSchema].concat(serverModules.schema), clientModules);
