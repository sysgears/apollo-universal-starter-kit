import { $Module$Schema } from './schema';
import Crud from '../../../packages/server/src/sql/crud';

export default class $Module$ extends Crud {
  public schema: any;
  constructor() {
    super();
    this.schema = $Module$Schema;
  }
}
