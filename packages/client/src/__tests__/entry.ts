import { initRenderer } from '@gqlapp/testing-client-react';
import { ROOT_SCHEMA } from '@gqlapp/core-common/graphql';
import clientModules from '..';
import serverModules from '../../../server/src/modules';

initRenderer([ROOT_SCHEMA].concat(serverModules.schema), clientModules);
