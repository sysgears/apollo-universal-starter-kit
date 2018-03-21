import { map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({ loginHandler, middleware }, ...features) {
    this.loginHandler = combine(arguments, arg => arg.loginHandler);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.onInit = combine(arguments, arg => arg.onInit);
  }
}
