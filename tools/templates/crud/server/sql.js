import { camelizeKeys } from 'humps';

import knex from '../../../server/sql/connector';

export default class $Module$ {
  async get$Module$s() {
    return camelizeKeys(await knex.select('*').from('$module$'));
  }

  async get$Module$() {
    return camelizeKeys(await knex.select('*').from('$module$').first());
  }

  delete$Module$(id) {
    return knex('$module$')
      .where('id', '=', id)
      .del();
  }
}
