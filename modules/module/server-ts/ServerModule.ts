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
  graphqlContext: { [key: string]: any };
  appContext: { [key: string]: any };
}

export type TWare = (app: Express, appContext: { [key: string]: any }, createContext: any) => void;

export interface ServerModuleShape extends CommonModuleShape {
  // GraphQL API
  schema?: DocumentNode[];
  createResolversFunc?: Array<(pubsub: PubSub) => IResolvers>;
  createContextFunc?: Array<
    (props: CreateContextFuncProps, appContext?: { [key: string]: any }) => { [key: string]: any }
  >;
  // Middleware
  beforeware?: TWare[];
  middleware?: TWare[];
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
    const appContext = this.appContext;
    let graphqlContext = {};

    for (const createContextFunc of this.createContextFunc) {
      graphqlContext = merge(
        graphqlContext,
        await createContextFunc({ req, res, connectionParams, webSocket, graphqlContext, appContext })
      );
    }
    return graphqlContext;
  }

  public createResolvers(pubsub: PubSub) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }
}

export default ServerModule;
