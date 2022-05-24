import { foldTo } from 'fractal-objects';
import React from 'react';
import { ConnectionParamsOptions } from 'subscriptions-transport-ws';

import { CreateApolloLink, CreateNetLink, ApolloLinkStateParams } from '@gqlapp/module-common';
import BaseModule, { BaseModuleShape } from './BaseModule';

/**
 * React client feature modules interface.
 */
export interface ClientModuleShape extends BaseModuleShape {
  // Route list
  route?: React.ReactElement<any>[];
  // Top left navigation links
  navItem?: React.ReactElement<any>[];
  // Top right navigation links
  navItemRight?: React.ReactElement<any>[];
}

/**
 * React client feature module implementation.
 */
class ClientModule extends BaseModule implements ClientModuleShape {
  // Array of functions to create non-network Apollo Link
  createLink?: CreateApolloLink[];
  // A singleton to create network link
  createNetLink?: CreateNetLink;
  // `subscription-transport-ws` WebSocket connection options
  connectionParam?: ConnectionParamsOptions[];
  // Apollo Link State default state and client resolvers
  resolver?: ApolloLinkStateParams[];
  // Route list
  route?: React.ReactElement<any>[];
  // Top left navigation links
  navItem?: React.ReactElement<any>[];
  // Top right navigation links
  navItemRight?: React.ReactElement<any>[];

  /**
   * Constructs React client feature module representation, that folds all the feature modules
   * into a single module represented by this instance.
   *
   * @param modules feature modules
   */
  constructor(...modules: ClientModuleShape[]) {
    super(...modules);
    foldTo(this, modules);
  }

  /**
   * @returns client-side React route components list
   */
  get routes() {
    return (this.route || []).map((component: React.ReactElement<any>, idx: number, items: React.ReactElement<any>[]) =>
      React.cloneElement(component, { key: component.key || idx + items.length })
    );
  }

  /**
   * @returns client-side top left navbar link component list
   */
  get navItems() {
    return (this.navItem || []).map(
      (component: React.ReactElement<any>, idx: number, items: React.ReactElement<any>[]) =>
        React.cloneElement(component, {
          key: component.key || idx + items.length,
        })
    );
  }

  /**
   * @returns client-side top right navbar link component list
   */
  get navItemsRight() {
    return (this.navItemRight || []).map(
      (component: React.ReactElement<any>, idx: number, items: React.ReactElement<any>[]) =>
        React.cloneElement(component, {
          key: component.key || idx + items.length,
        })
    );
  }
}

export default ClientModule;
