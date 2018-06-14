import { CategorySchema } from './schema';
import Crud from '../../sql/crud';

export default class Category extends Crud {
  constructor() {
    super();
    this.schema = CategorySchema;
  }
}
