import { SchemaLink } from 'apollo-link-schema';
import CURRENT_USER_QUERY from '@module/user-client-react/graphql/CurrentUserQuery.graphql';

import modules from '../../../../modules';
import { isApiExternal, apiUrl } from '../../../../net';
import createApolloClient from '../../../../../../common/createApolloClient';

export default async function getCurrentUser(req, res) {
  const schema = require('../../../../api/schema').default;
  const schemaLink = new SchemaLink({ schema, context: await modules.createContext(req, res) });
  const client = createApolloClient({
    apiUrl,
    createNetLink: !isApiExternal ? () => schemaLink : undefined
  });

  return await client.query({ query: CURRENT_USER_QUERY });
}
