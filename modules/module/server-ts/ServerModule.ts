import { merge } from 'lodash';
import { DocumentNode } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { Express } from 'express';
import { ConnectionParamsOptions } from 'subscriptions-transport-ws';
import { IResolvers } from 'graphql-tools';
import CommonModule, { CommonModuleShape } from '@gqlapp/module-common';

/**
 * A function to create GraphQL context
 *
 * @param props various params passed to function
 *
 * @returns an object which will be merged into GraphQL context object
 */
type CreateContextFunc = (props: CreateContextFuncProps) => { [key: string]: any };

/**
 * Create GraphQL context function params
 */
interface CreateContextFuncProps {
  // HTTP request
  req: Request;
  // HTTP response
  res: Response;
  // `subscriptions-transport-ws` WebSocket connection params
  connectionParams: ConnectionParamsOptions;
  // webSocket implementation
  webSocket: WebSocket;
  // Current GraphQL context object
  graphqlContext: { [key: string]: any };
  // Application context object
  appContext: { [key: string]: any };
}

/**
 * A function to create GraphQL resolvers
 *
 * @param pubsub a publish subscribe engine for GraphQL subscriptions
 *
 * @returns GraphQL resolvers
 */
type CreateResolversFunc = (pubsub: PubSub) => IResolvers;

/**
 * A function which registers new middleware.
 *
 * @param app an instance of Express
 * @param appContext application context
 */
type MiddlewareFunc = (app: Express, appContext: { [key: string]: any }) => void;

/**
 * Server feature modules interface
 */
export interface ServerModuleShape extends CommonModuleShape {
  // A GraphQL schema list of a module
  schema?: DocumentNode[];
  // A list of functions to create GraphQL resolvers
  createResolversFunc?: CreateResolversFunc[];
  // A list of functions to create GraphQL context
  createContextFunc?: CreateContextFunc[];
  // A list of functions to register high-priority middlewares (happens before registering normal priority ones)
  beforeware?: MiddlewareFunc[];
  // A list of functions to register normal-priority middlewares
  middleware?: MiddlewareFunc[];
}

interface ServerModule extends ServerModuleShape {}

/**
 * A class that represents server-side feature module
 *
 * An instance of this class is exported by each Node backend feature module
 */
class ServerModule extends CommonModule {
  /**
   * Constructs backend Node feature module representation, that folds all the feature modules
   * into a single module represented by this instance.
   *
   * @param modules feature modules
   */
  constructor(...modules: ServerModuleShape[]) {
    super(...modules);
  }

  /**
   * @returns list of GraphQL schemas exported by the feature module represented by this class
   */
  public get schemas() {
    return this.schema;
  }

  /**
   * Creates GraphQL context for this module
   *
   * @param req HTTP request
   * @param res HTTP response
   * @param connectionParams `subscriptions-transport-ws` webSocket connnection params
   * @param webSocket WebSockets implementation
   *
   * @returns GraphQL context
   */
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

  /**
   * Creates GraphQL resolvers exported by this module.
   *
   * @param pubsub Publish subscribe engine for GraphQL subscriptions
   *
   * @returns GraphQL resolvers
   */
  public createResolvers(pubsub: PubSub) {
    return merge({}, ...this.createResolversFunc.map(createResolvers => createResolvers(pubsub)));
  }
}

export default ServerModule;
