import { ProductSchema } from './schema';
import Crud from '../../sql/crud';

export default class Product extends Crud {
  constructor() {
    super();
    this.schema = ProductSchema;
  }
}
