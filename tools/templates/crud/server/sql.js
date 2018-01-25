import { decamelize } from 'humps';

import { $Module$ as $Module$Schema } from './schema';
import Crud from '../../../src/sql/crud';

export default class $Module$ extends Crud {
  constructor() {
    super();

    this.prefix = '';
    this.tableName = decamelize($Module$Schema.name);
    this.schema = $Module$Schema;
  }
}
