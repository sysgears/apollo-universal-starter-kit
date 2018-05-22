import { SchemaLink } from 'apollo-link-schema';
import modules from '../../../../modules';
import schema from '../../../../api/schema';
import { isApiExternal, apiUrl } from '../../../../net';
import createApolloClient from '../../../../../../common/createApolloClient';
import CURRENT_USER_QUERY from '../../../../../../client/src/modules/user/graphql/CurrentUserQuery.graphql';

export default async function getCurrentUser(req, res) {
  const clientModules = require('../../../../../../client/src/modules').default;
  const schemaLink = new SchemaLink({ schema, context: await modules.createContext(req, res) });
  const client = createApolloClient({
    apiUrl,
    createNetLink: !isApiExternal ? () => schemaLink : undefined,
    links: clientModules.link,
    clientResolvers: clientModules.resolvers
  });

  return await client.query({ query: CURRENT_USER_QUERY });
}
