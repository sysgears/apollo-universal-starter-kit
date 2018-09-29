import BaseConnector, { BaseFeature, combine } from './BaseConnector';

import { merge } from 'lodash';

interface FeatureShape extends BaseFeature {
  drawerItem?: any | any[];
}

export default class extends BaseConnector {
  public drawerItem: any[];

  constructor(...features: FeatureShape[]) {
    super(...features);

    // Navigation
    this.drawerItem = combine(features, arg => arg.drawerItem);
  }

  get drawerItems() {
    return merge({}, ...this.drawerItem);
  }

  public getSkippedDrawerItems() {
    const items = this.drawerItems;
    return Object.keys(items).filter(itemName => {
      return items[itemName].skip;
    });
  }
}
