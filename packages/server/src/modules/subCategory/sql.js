import { SubCategorySchema } from './schema';
import Crud from '../../sql/crud';

export default class SubCategory extends Crud {
  constructor() {
    super();
    this.schema = SubCategorySchema;
  }
}
