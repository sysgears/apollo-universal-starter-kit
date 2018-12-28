import { initRenderer } from '@module/testing-client-react';
import rootSchema from '@module/core-server-ts/graphql/rootSchema.graphql';
import clientModules from '..';
import serverModules from '../../../server/src/modules';

initRenderer([rootSchema].concat(serverModules.schema), clientModules);
