import { map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

class Feature {
  // eslint-disable-next-line
  constructor({ login }) {
    this.login = combine(arguments, arg => arg.login)
      .slice(-1)
      .pop();
    this.schema = combine(arguments, arg => arg.schema);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
  }
}

export default Feature;
