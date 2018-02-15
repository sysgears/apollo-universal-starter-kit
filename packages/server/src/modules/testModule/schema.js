import DomainSchema, { Schema } from 'domain-schema';

export class TestModule extends Schema {
  __ = { name: 'TestModule', tablePrefix: '' };
  id = DomainSchema.Int;
  name = {
    type: String,
    searchText: true
  };
}

export const TestModuleSchema = new DomainSchema(TestModule);
