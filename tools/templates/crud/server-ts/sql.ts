import { $Module$Schema } from './schema';
import { Crud } from '@gqlapp/database-server-ts';

export default class $Module$ extends Crud {
  public schema: any;
  constructor() {
    super();
    this.schema = $Module$Schema;
  }
}
