import { graphiqlExpress } from 'graphql-server-express';
import { app as settings } from '../../../package.json';

const port = process.env.PORT || settings.apiPort;
const subscriptionsUrl = `ws://localhost:${port}`;

export default graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: subscriptionsUrl,
  query:
   '{\n' +
   '  count {\n' +
   '    amount\n' +
   '  }\n' +
   '}'
});
