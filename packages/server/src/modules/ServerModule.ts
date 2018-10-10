import { merge } from 'lodash';

// types
import { DocumentNode } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { IResolvers } from 'graphql-tools';
import { Express } from 'express';

import Module from './Module';

export interface ServerModuleShape {
  // Localization
  localization?: Array<{ ns: string; resources: any }>;
  // GraphQL API
  schema?: DocumentNode[];
  createResolversFunc?: Array<(pubsub?: PubSub) => IResolvers>;
  createContextFunc?: Array<({ req, res, connectionParams, webSocket, context }: any) => { [key: string]: any }>;
  // Middleware
  beforeware?: Array<(app: Express) => void>;
  middleware?: Array<(app: Express) => void>;
  // Shared modules data
  data?: any;
}

interface ServerModule extends ServerModuleShape {}

class ServerModule extends Module {
  constructor(...modules: ServerModuleShape[]) {
    super(...modules);
  }

  public get schemas() {
    return this.schema;
  }

  public async createContext(req: any, res: any, connectionParams?: any, webSocket?: any) {
    let context = {};
    for (const createContextFunc of this.createContextFunc) {
      context = merge(context, await createContextFunc({ req, res, connectionParams, webSocket, context }));
    }
    return context;
  }

  public createResolvers(pubsub: PubSub) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }
}

export default ServerModule;
