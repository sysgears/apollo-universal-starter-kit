import { TestModuleSchema } from './schema';
import Crud from '../../sql/crud';

export default class TestModule extends Crud {
  constructor() {
    super();
    this.schema = TestModuleSchema;
  }
}
