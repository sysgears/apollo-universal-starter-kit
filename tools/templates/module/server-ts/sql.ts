import { knex, Crud } from '@gqlapp/database-server-ts';
import { $Module$Schema } from '@gqlapp/$-module$-common';

export default class $Module$ extends Crud {
  public schema: any;
  constructor() {
    super();
    this.schema = $Module$Schema;
  }

  public $module$s() {
    return knex.select();
  }
}
