import { graphiqlExpress } from 'apollo-server-express';
import * as url from 'url';
import { log } from '../../common/log';

const { protocol, hostname, pathname, port } = url.parse(__BACKEND_URL__);

const graphiqlMiddleware = graphiqlExpress(req => {
  try {
    const subscriptionsUrl = (hostname === 'localhost'
      ? `${protocol}//${url.parse(req.get('Referer') || `${protocol}//${hostname}`).hostname}:${port}${pathname}`
      : __BACKEND_URL__
    ).replace(/^http/, 'ws');

    return {
      endpointURL: '/graphql',
      subscriptionsEndpoint: subscriptionsUrl,
      query: '{\n' + '  counter {\n' + '    amount\n' + '  }\n' + '}'
    };
  } catch (e) {
    log.error(e.stack);
  }
});

export { graphiqlMiddleware };
