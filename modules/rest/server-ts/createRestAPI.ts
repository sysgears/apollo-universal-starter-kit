import { Express } from 'express';
import { GraphQLSchema } from 'graphql';
import bodyParser from 'body-parser';

import ServerModule from '@gqlapp/module-server-ts';
import sofa, { OpenAPI } from '@hofstadter-io/sofa-api';
import settings from '@gqlapp/config';

import swaggerUi from 'swagger-ui-express';

const createRestAPI = (app: Express, schema: GraphQLSchema, modules: ServerModule) => {
  // need to enable explicitly
  if (settings.rest.enabled) {
    // setup the openApi objecct
    const openApi = OpenAPI({
      schema,
      info: {
        title: settings.app.name,
        version: '0.0.0'
      }
    });

    // need to parse json bodies for sofa (maybe others, content negotiation middleware anywhere?)
    app.use(settings.rest.basePath, bodyParser.json());

    // setups up sofa at basepath
    app.use(
      settings.rest.basePath,
      sofa({
        schema,
        onRoute: info => {
          openApi.addRoute(info, {
            basePath: settings.rest.basePath
          });
        },
        // construct the context, this shows up as the context parameter to resolvers
        context: async ({ req, res }) => {
          const ctx = await modules.createContext(req, res);
          return {
            req,
            res,
            ...ctx
          };
        }
      })
    );

    // possibly setup a swagger interface
    if (settings.rest.swaggerPath) {
      const swaggerDocument = openApi.get();
      app.use(settings.rest.basePath + settings.rest.swaggerPath, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }
  }
};

export default createRestAPI;
