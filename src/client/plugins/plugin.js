import { merge, map, union, without, castArray } from 'lodash';

const combine = (plugins, extractor) => without(union(...map(plugins, res => castArray(extractor(res)))), undefined);

export const pluginCatalog = {};

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({ route, navItem, reducer, catalogInfo }, ...plugins) {
    /* eslint-enable no-unused-vars */
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (pluginCatalog[key] = info[key]))
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
