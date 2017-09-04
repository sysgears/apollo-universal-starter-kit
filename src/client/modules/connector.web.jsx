import React from 'react';

import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) =>
  without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({route, navItem, reducer}, ...features) {
    this.route = combine(arguments, arg => arg.route);
    this.navItem = combine(arguments, arg => arg.navItem);
    this.navItemRight = combine(arguments, arg => arg.navItemRight);
    this.reducer = combine(arguments, arg => arg.reducer);
  }

  get routes() {
    return this.route.map((component, idx) =>
      React.cloneElement(component, { key: idx + this.route.length })
    );
  }

  get navItems() {
    return this.navItem.map((component, idx) =>
      React.cloneElement(component, { key: idx + this.navItem.length })
    );
  }

  get navItemsRight() {
    return this.navItemRight.map((component, idx) =>
      React.cloneElement(component, { key: idx + this.navItemRight.length })
    );
  }

  get reducers() {
    return merge(...this.reducer);
  }
}
