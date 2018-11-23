import knex from '../../../packages/server/src/sql/connector';

export default class $Module$ {
  public $module$s() {
    return knex.select();
  }
}
