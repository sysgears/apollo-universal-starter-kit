import knex from '../../../server/sql/connector';

export default class $Module$ {
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
