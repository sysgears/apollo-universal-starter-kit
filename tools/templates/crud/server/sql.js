import { camelizeKeys } from 'humps';

import knex from '../../../server/sql/connector';

export default class $Module$ {
  async get$Module$s() {
    return camelizeKeys(await knex.select('*').from('$module$'));
  }

  async get$Module$() {
    return camelizeKeys(await knex.select('*').from('$module$').first());
  }

  add$Module$(input) {
    return knex('$module$')
      .insert(input)
      .returning('id');
  }

  edit$Module$({ id, ...input}) {
    return knex('$module$')
      .update(input)
      .where({ id });
  }

  delete$Module$(id) {
    return knex('$module$')
      .where('id', '=', id)
      .del();
  }
}
