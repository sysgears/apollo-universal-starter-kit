import { $Module$Schema } from './schema';
import Crud from '../../sql/crud';

export default class $Module$ extends Crud {
  constructor() {
    super();
    this.schema = $Module$Schema;
  }
}
