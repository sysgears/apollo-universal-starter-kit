import { merge, map, union, without, castArray } from 'lodash';
import log from '../../../common/log';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export const featureCatalog = {};

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor() {
    /* eslint-enable no-unused-vars */
    combine(arguments, arg => arg.catalogInfo).forEach(info =>
      Object.keys(info).forEach(key => (featureCatalog[key] = info[key]))
    );
    this.tabItem = combine(arguments, arg => arg.tabItem);
    this.reducer = combine(arguments, arg => arg.reducer);
    this.resolver = combine(arguments, arg => arg.resolver);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.afterware = combine(arguments, arg => arg.afterware);
    this.connectionParam = combine(arguments, arg => arg.connectionParam);
    this.createFetchOptions = combine(arguments, arg => arg.createFetchOptions);
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

  get middlewares() {
    return this.middleware;
  }

  get afterwares() {
    return this.afterware;
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
}
