import { ProductTypeSchema } from './schema';
import Crud from '../../sql/crud';

export default class ProductType extends Crud {
  constructor() {
    super();
    this.schema = ProductTypeSchema;
  }
}
