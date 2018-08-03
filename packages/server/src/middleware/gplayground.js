import url from 'url';
import expressPlayground from 'graphql-playground-middleware-express';

import { isApiExternal, serverPort } from '../net';

export default req => {
  const { protocol, hostname } = url.parse(req.get('Referer') || `http://localhost`);
  const subscriptionsUrl = (!isApiExternal
    ? `${protocol}//${hostname}:${serverPort}${__API_URL__}`
    : __API_URL__
  ).replace(/^http/, 'ws');

  return expressPlayground({
    endpoint: '/graphql',
    subscriptionEndpoint: subscriptionsUrl,
    tabs: [
      {
        endpoint: '/graphql',
        query: '{\n' + '  serverCounter {\n' + '    amount\n' + '  }\n' + '}'
      }
    ]
  });
};
