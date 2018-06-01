import { GraphQLServer } from 'graphql-yoga';
import { Prisma } from 'prisma-binding';

import schema from './api/schema';

const options = {
  port: __SERVER_PORT__,
  endpoint: __API_URL__,
  playground: '/playground',
  cors: {
    credentials: true,
    origin: true
  },
  debug: true
};

const server = new GraphQLServer({
  ...schema,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: process.cwd() + '/src/modules/generated/prisma.graphql', // the generated Prisma DB schema
      endpoint: __PRISMA_ENDPOINT__, // the endpoint of the Prisma DB service
      debug: true // log all GraphQL queries & mutations
    })
  })
});

/*server.express.use(
  '/',
  server.express.static(__FRONTEND_BUILD_DIR__, {
    maxAge: '180 days'
  })
);

if (__DEV__) {
  server.express.use('/', server.express.static(__DLL_BUILD_DIR__, { maxAge: '180 days' }));
}*/

server.start(options, () => console.log(`The server is running on http://localhost:${__SERVER_PORT__}`));

export default server;
