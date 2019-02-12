import { Express } from 'express';
import { GraphQLSchema } from 'graphql';
import bodyParser from 'body-parser';

import ServerModule from '@gqlapp/module-server-ts';
import sofa, { OpenAPI } from '@hofstadter-io/sofa-api';

import swaggerUi from 'swagger-ui-express';



import settings from '../../../settings';

const createRestAPI = (app: Express, schema: GraphQLSchema, modules: ServerModule) => {

  if (settings.rest.enabled) {

    const openApi = OpenAPI({
      schema,
      info: {
        title: settings.app.name,
        version: '0.0.0'
      }
    });

    app.use(
      settings.rest.basePath,
      bodyParser.json()
    )

    app.use(
      settings.rest.basePath,
      sofa({
        schema,
        onRoute: info => {
          // console.log(info);
          if (info.path == "/login") {
            console.log(JSON.stringify(info.document, null, 2))
          }
          openApi.addRoute(info, {
            basePath: settings.rest.basePath
          });
        },
        context: async ({ req, res }) => {
          return modules.createContext(req, res);
        }
      })
    );

    // writes every recorder route
    const swaggerDocument = openApi.get();

    app.use(settings.rest.basePath + '/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  }
};

export default createRestAPI;
