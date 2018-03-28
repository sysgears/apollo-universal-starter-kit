import { merge, map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

class Feature {
  // eslint-disable-next-line
  constructor({ grant, schema, middleware, createResolversFunc, createContextFunc, htmlHeadComponent }) {
    this.grant = combine(arguments, arg => arg.grant);
    this.schema = combine(arguments, arg => arg.schema);
    this.middleware = combine(arguments, arg => arg.middleware);
    this.createResolversFunc = combine(arguments, arg => arg.createResolversFunc);
    this.createContextFunc = combine(arguments, arg => arg.createContextFunc);
    this.htmlHeadComponent = combine(arguments, arg => arg.htmlHeadComponent);
  }

  get grantAccess() {
    return async (user, req) => {
      let result = {};
      for (const grant of this.grant) {
        result = merge(result, await grant(user, req));
      }
      return result;
    };
  }
}

export default Feature;
