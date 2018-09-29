import React from 'react';
import BaseConnector, { BaseFeature, combine } from './BaseConnector';

interface FeatureShape extends BaseFeature {
  route?: any | any[];
  navItem?: any | any[];
  navItemRight?: any | any[];
  stylesInsert?: any | any[];
  scriptsInsert?: any | any[];
}

export default class extends BaseConnector {
  public route: any[];
  public navItem: any[];
  public navItemRight: any[];
  public stylesInsert: any[];
  public scriptsInsert: any[];

  constructor(...features: FeatureShape[]) {
    super(...features);
    // Navigation
    this.route = combine(features, arg => arg.route);
    this.navItem = combine(features, arg => arg.navItem);
    this.navItemRight = combine(features, arg => arg.navItemRight);

    // TODO: Use React Helmet for those. Low level DOM manipulation
    this.stylesInsert = combine(features, arg => arg.stylesInsert);
    this.scriptsInsert = combine(features, arg => arg.scriptsInsert);
  }

  get routes() {
    return this.route.map((component: any, idx: number) =>
      React.cloneElement(component, { key: idx + this.route.length })
    );
  }

  get navItems() {
    return this.navItem.map((component: any, idx: number) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length
      })
    );
  }

  get navItemsRight() {
    return this.navItemRight.map((component: any, idx: number) =>
      React.cloneElement(component, {
        key: component.key ? component.key : idx + this.navItem.length
      })
    );
  }

  get stylesInserts() {
    return this.stylesInsert;
  }

  get scriptsInserts() {
    return this.scriptsInsert;
  }
}
