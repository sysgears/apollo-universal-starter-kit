import { CustomerSchema } from './schema';
import Crud from '../../sql/crud';

export default class Customer extends Crud {
  constructor() {
    super();
    this.schema = CustomerSchema;
  }
}
