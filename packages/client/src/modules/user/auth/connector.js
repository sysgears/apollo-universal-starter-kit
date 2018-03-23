import { map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({ loginHandler, link, dataRootComponent }, ...features) {
    this.loginHandler = combine(arguments, arg => arg.loginHandler);
    this.dataRootComponent = combine(arguments, arg => arg.dataRootComponent);
    this.link = combine(arguments, arg => arg.link);
  }
}
