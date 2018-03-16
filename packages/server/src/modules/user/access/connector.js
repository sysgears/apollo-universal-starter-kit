import { map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

class Feature {
  // eslint-disable-next-line
  constructor({ grant, revoke, middleware, schema, createResolversFunc, createContextFunc }) {
    this.grant = combine(arguments, arg => arg.grant)
      .slice(-1)
      .pop();
    this.revoke = combine(arguments, arg => arg.revoke)
      .slice(-1)
      .pop();
    this.middleware = combine(arguments, arg => arg.middleware);
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
  }
}

export default Feature;
