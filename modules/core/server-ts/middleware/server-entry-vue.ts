// // tslint:disable-block
// import path from 'path';
// import { SchemaLink } from 'apollo-link-schema';
// import { GraphQLSchema } from 'graphql';
// import { createRenderer } from 'vue-server-renderer';
// import { isApiExternal, apiUrl, createApolloClient } from '@module/core-common';
// import ServerModule from '@module/module-server-ts';
// import ClientModule from '@module/module-client-vue';
// import { createApp } from '@module/core-client-vue';

// let clientModules: ClientModule;

// if (__SSR__) {
//   clientModules = require('../../../../packages/client-vue/src').default;
// }

// const Html = (markup: string) => `
//   <html lang='en'>
//     <head>

//     </head>
//     <body>
//       <div id='root'>
//         ${markup}
//         <!--vue-ssr-outlet-->
//       </div>
//     </body>
//   </html>
// `;

// const renderServerSide = async (req: any, res: any, schema: GraphQLSchema, modules: ServerModule) => {
//   // const schemaLink = new SchemaLink({
//   //   schema,
//   //   context: { ...(await modules.createContext(req, res)), req, res }
//   // });

//   // const client: any = createApolloClient({
//   //   apiUrl,
//   //   connectionParams: null,
//   //   links: clientModules.link,
//   //   clientResolvers: clientModules.resolvers,
//   //   createNetLink: !isApiExternal ? () => schemaLink : undefined
//   // });

//   // const stores = Object.keys(clientModules.reducers).reduce(
//   //   (store, value) => ({ ...store, [value]: clientModules.reducers[value] }),
//   //   {}
//   // );

//   // const { app, router } = createApp({ stores, routes: clientModules.routes, client });
//   // const renderer = createRenderer();

//   // router.push(req.url);

//   const context: any = {};

//   if (context.url) {
//     res.writeHead(301, { Location: context.url });
//     res.end();
//   } else {
//     // renderer.renderToString(app).then(appString => {
//     //   console.log('============= appString : ', appString)
//     //   res.send(`<!doctype html>\n${Html()}`);
//     //   res.end();
//     // }).catch(error => {
//     //   res.send(`<!doctype html>\n${Html()}`);
//     //   res.end();
//     // })

//     res.send(`<!doctype html>\n${Html('Test')}`);
//     res.end();
//   }
// };

// export default (schema: GraphQLSchema, modules: ServerModule) => async (
//   req: any,
//   res: any,
//   next: (e?: Error) => void
// ) => {
//   try {
//     if (req.path.indexOf('.') < 0 && __SSR__) {
//       return await renderServerSide(req, res, schema, modules);
//     } else if (!__SSR__ && req.method === 'GET') {
//       res.sendFile(path.resolve(__FRONTEND_BUILD_DIR__, 'index.html'));
//     } else {
//       next();
//     }
//   } catch (e) {
//     next(e);
//   }
// };
