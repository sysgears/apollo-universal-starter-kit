import { map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

class Feature {
  // eslint-disable-next-line
  constructor({ schema, middleware, createResolversFunc }) {
    this.schema = combine(arguments, arg => arg.schema);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
  }
}

export default Feature;
