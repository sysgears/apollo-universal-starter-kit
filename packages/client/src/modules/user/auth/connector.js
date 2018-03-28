import { map, union, without, castArray } from 'lodash';

const combine = (features, extractor) => without(union(...map(features, res => castArray(extractor(res)))), undefined);

export default class {
  // eslint-disable-next-line no-unused-vars
  constructor({ link, dataRootComponent, logout }, ...features) {
    this.link = combine(arguments, arg => arg.link);
    this.dataRootComponent = combine(arguments, arg => arg.dataRootComponent);
    this.logout = combine(arguments, arg => arg.logout);
  }

  async doLogout(client) {
    for (const logout of this.logout) {
      await logout(client);
    }
  }
}
