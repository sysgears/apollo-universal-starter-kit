import { graphiqlExpress } from 'apollo-server-express';

const subscriptionsUrl = __BACKEND_URL__.replace(/^http/, 'ws');

export default graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: subscriptionsUrl,
  query: '{\n' + '  counter {\n' + '    amount\n' + '  }\n' + '}'
});
