import { initRenderer } from '@gqlapp/testing-client-react';
import { rootSchemaDef } from '@gqlapp/graphql-server-ts';
import clientModules from '..';
import serverModules from '../../../server/src/modules';

initRenderer([rootSchemaDef].concat(serverModules.schema), clientModules);
