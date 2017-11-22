import { camelizeKeys } from 'humps';

import knex from '../../../server/sql/connector';

export default class $Module$ {
  async get$Module$s() {
    return camelizeKeys(await knex.select('*').from('$module$'));
  }
}
