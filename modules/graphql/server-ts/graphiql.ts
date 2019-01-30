import * as url from 'url';
import * as express from 'express';
import * as GraphiQL from 'apollo-server-module-graphiql';
import { isApiExternal, serverPort } from '@gqlapp/core-common';

type ExpressGraphQLOptionsFunction = (req?: express.Request, res?: express.Response) => any | Promise<any>;

function graphiqlExpress(options: GraphiQL.GraphiQLData | ExpressGraphQLOptionsFunction) {
  const graphiqlHandler = (req: express.Request, res: express.Response, next: any) => {
    const query = req.url && url.parse(req.url, true).query;
    GraphiQL.resolveGraphiQLString(query, options, req).then(
      graphiqlString => {
        res.setHeader('Content-Type', 'text/html');
        res.write(graphiqlString);
        res.end();
      },
      error => next(error)
    );
  };

  return graphiqlHandler;
}

export default graphiqlExpress((req: express.Request) => {
  const { protocol, hostname } = url.parse(req.get('Referer') || `http://localhost`);
  const subscriptionsUrl = (!isApiExternal
    ? `${protocol}//${hostname}:${serverPort}${__API_URL__}`
    : __API_URL__
  ).replace(/^http/, 'ws');

  return {
    endpointURL: '/graphql',
    subscriptionsEndpoint: subscriptionsUrl,
    query: '{\n' + '  serverCounter {\n' + '    amount\n' + '  }\n' + '}'
  };
});
