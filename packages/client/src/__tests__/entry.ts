import { initRenderer } from '@gqlapp/testing-client-react';
import rootSchema from '@gqlapp/core-server-ts/api/rootSchema.graphql';
import clientModules from '..';
import serverModules from '../../../server/src/modules';

initRenderer([rootSchema].concat(serverModules.schema), clientModules);
