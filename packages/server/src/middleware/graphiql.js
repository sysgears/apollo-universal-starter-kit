import { graphiqlExpress } from 'apollo-server-express';
import url from 'url';

import { isApiExternal, serverPort } from '../net';

export default graphiqlExpress(req => {
  const { protocol, hostname } = url.parse(req.get('Referer') || `http://localhost`);
  const subscriptionsUrl = (!isApiExternal
    ? `${protocol}//${hostname}:${serverPort}${__API_URL__}`
    : __API_URL__
  ).replace(/^http/, 'ws');

  return {
    endpointURL: '/graphql',
    subscriptionsEndpoint: subscriptionsUrl,
    query: '{\n' + '  counter {\n' + '    amount\n' + '  }\n' + '}'
  };
});
