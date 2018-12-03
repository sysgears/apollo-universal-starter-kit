import { initRenderer } from '@module/testing-client-react';
import clientModules from '..';
import serverModules from '../../../server/src/modules';
import rootSchema from '../../../server/src/api/rootSchema.graphql';

initRenderer([rootSchema].concat(serverModules.schema), clientModules);
