import React from 'react';
import { merge } from 'lodash';
import { ReducersMapObject } from 'redux';

import { GraphQLModule, GraphQLModuleShape } from '@gqlapp/module-common';

/**
 * Common module interface for React and React Native feature modules
 */
export interface BaseModuleShape extends GraphQLModuleShape {
  // Redux reducers list
  reducer?: ReducersMapObject[];
  // React element that does client-side routing, see `router` feature module
  router?: React.ReactElement<any>;
  // Root component factory list
  rootComponentFactory?: RootComponentFactory[];
  // Data root React elements list (data root elements wraps data fetching react subtree root)
  dataRootComponent?: React.ComponentType[];
}

/**
 * A function that creates React Element that wraps root element of a React tree
 */
type RootComponentFactory = (req: Request) => React.ReactElement<any>;

interface BaseModule extends BaseModuleShape {}

/**
 * Base module ancestor for React and React Native feature modules.
 */
class BaseModule extends GraphQLModule {
  /**
   * Constructs base module representation, that folds all the feature modules
   * into a single module represented by this instance.
   *
   * @param modules feature modules
   */
  constructor(...modules: BaseModuleShape[]) {
    super(...modules);
  }

  /**
   * @returns Redux reducers
   */
  get reducers() {
    return merge({}, ...(this.reducer || []));
  }

  /**
   *
   * @param root React tree data root component (first React root components which is used for fetching data)
   *
   * @returns React tree data root component wrapped up by data root components exposed by this module
   */
  public getDataRoot(root: React.ReactElement<any>) {
    let nestedRoot = root;
    for (const component of this.dataRootComponent || []) {
      nestedRoot = React.createElement(component, {}, nestedRoot);
    }
    return nestedRoot;
  }

  /**
   *
   * @param root React tree root component
   *
   * @returns React tree root component wrapped up by root components exposed by this module
   */
  public getWrappedRoot(root: React.ReactElement<any>, req?: Request) {
    let nestedRoot = root;
    for (const componentFactory of this.rootComponentFactory || []) {
      nestedRoot = React.cloneElement(componentFactory(req), {}, nestedRoot);
    }
    return nestedRoot;
  }
}

export default BaseModule;
