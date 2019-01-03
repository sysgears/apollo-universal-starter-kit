import { createSchema } from '@module/core-server-ts';
import { createApolloClient, isApiExternal, apiUrl } from '@module/core-common';
import { CURRENT_USER_QUERY } from '@module/user-client-react';

import { SchemaLink } from 'apollo-link-schema';
import modules from '../../../../packages/server/src/modules';

export default async function getCurrentUser(req, res) {
  const schema = createSchema(modules);

  const schemaLink = new SchemaLink({ schema, context: await modules.createContext(req, res) });
  const client = createApolloClient({
    apiUrl,
    createNetLink: !isApiExternal ? () => schemaLink : undefined
  });

  return await client.query({ query: CURRENT_USER_QUERY });
}
