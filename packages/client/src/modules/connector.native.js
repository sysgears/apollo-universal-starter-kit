import { merge, map, union, without, castArray } from 'lodash';
import log from '../../../common/log';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export const featureCatalog = {};

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({ link, createFetch, route, navItem, reducer, resolver, routerFactory, catalogInfo }, ...features) {
    /* eslint-enable no-unused-vars */
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.link = combine(arguments, arg => arg.link);
    this.createFetch = combine(arguments, arg => arg.createFetch)
      .slice(-1)
      .pop();
    this.tabItem = combine(arguments, arg => arg.tabItem);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.resolver = combine(arguments, arg => arg.resolver);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
    this.routerFactory = combine(arguments, arg => arg.routerFactory)
      .slice(-1)
      .pop();
  }

  get tabItems() {
    return merge(...this.tabItem);
  }

  get reducers() {
    return merge(...this.reducer);
  }

  get resolvers() {
    return merge(...this.resolver);
  }

  get connectionParams() {
    return this.connectionParam;
  }

  get constructFetchOptions() {
    return this.createFetchOptions.length
      ? (...args) => {
          try {
            let result = {};
            for (let func of this.createFetchOptions) {
              result = { ...result, ...func(...args) };
            }
            return result;
          } catch (e) {
            log.error(e.stack);
          }
        }
      : null;
  }

  get router() {
    return this.routerFactory();
  }
}
