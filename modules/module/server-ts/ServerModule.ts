import { merge } from 'lodash';
import { DocumentNode } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { Express } from 'express';
import { ConnectionParamsOptions } from 'subscriptions-transport-ws';
import { IResolvers } from 'graphql-tools';
import CommonModule, { CommonModuleShape } from '@gqlapp/module-common';

interface CreateContextFuncProps {
  req: Request;
  res: Response;
  connectionParams: ConnectionParamsOptions;
  webSocket: WebSocket;
  apolloContext: { [key: string]: any };
}

export interface ServerModuleShape extends CommonModuleShape {
  // GraphQL API
  schema?: DocumentNode[];
  createResolversFunc?: Array<(pubsub: PubSub) => IResolvers>;
  createContextFunc?: Array<
    (props: CreateContextFuncProps, context?: { [key: string]: any }) => { [key: string]: any }
  >;
  // Middleware
  beforeware?: Array<(app: Express, context: { [key: string]: any }) => void>;
  middleware?: Array<(app: Express, context: { [key: string]: any }) => void>;
  // Shared modules data
  data?: { [key: string]: any };
}

interface ServerModule extends ServerModuleShape {}

class ServerModule extends CommonModule {
  public modules?: ServerModule;

  constructor(...modules: ServerModuleShape[]) {
    super(...modules);
  }

  public get schemas() {
    return this.schema;
  }

  public async createContext(
    req: Request,
    res: Response,
    connectionParams?: ConnectionParamsOptions,
    webSocket?: WebSocket
  ) {
    let apolloContext = {};

    for (const createContextFunc of this.createContextFunc) {
      apolloContext = merge(
        apolloContext,
        await createContextFunc({ req, res, connectionParams, webSocket, apolloContext }, this.context)
      );
    }
    return apolloContext;
  }

  public createResolvers(pubsub: PubSub) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }
}

export default ServerModule;
