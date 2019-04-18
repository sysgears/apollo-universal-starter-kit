import { Express } from 'express';
import CommonModule, { CommonModuleShape } from '@gqlapp/module-common';

/**
 * A function which registers new middleware.
 *
 * @param app an instance of Express
 * @param appContext application context
 * @param options application additional options
 */
export type MiddlewareFunc = (app: Express, appContext: { [key: string]: any }, options: any) => void;

/**
 * Server feature modules interface
 */
export interface ServerModuleShape extends CommonModuleShape {
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
}

export default ServerModule;
