import { initRenderer } from '@gqlapp/testing-client-react';
import { rootSchemaDef } from '@gqlapp/graphql-server-server-ts';
import clientModules from '..';
import graphqlModules from '../../../server/src/modules';

initRenderer([rootSchemaDef].concat(graphqlModules.schema), clientModules);
