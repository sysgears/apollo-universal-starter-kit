import knex from '../../sql/connector';

export default class $Module$ {
  public $module$s() {
    return knex.select();
  }
}
