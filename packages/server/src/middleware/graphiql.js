import { graphiqlExpress } from 'apollo-server-express';
import url from 'url';

const { protocol, hostname, pathname, port } = url.parse(__BACKEND_URL__);

export default graphiqlExpress(req => {
  const subscriptionsUrl = (hostname === 'localhost'
    ? `${protocol}//${url.parse(req.get('Referer') || `${protocol}//${hostname}`).hostname}:${port}${pathname}`
    : __BACKEND_URL__
  ).replace(/^http/, 'ws');

  return {
    endpointURL: '/graphql',
    subscriptionsEndpoint: subscriptionsUrl,
    query: '{\n' + '  counter {\n' + '    amount\n' + '  }\n' + '}'
  };
});
