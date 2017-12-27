import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export const featureCatalog = {};

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({ route, navItem, reducer, catalogInfo }, ...features) {
    /* eslint-enable no-unused-vars */
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.tabItem = combine(arguments, arg => arg.tabItem);
    this.reducer = combine(arguments, arg => arg.reducer);
  }

  get tabItems() {
    return merge(...this.tabItem);
  }

  get reducers() {
    return merge(...this.reducer);
  }
}
