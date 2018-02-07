import DomainSchema, { Schema } from 'domain-schema';

export class Customer extends Schema {
  __ = { name: 'Customer', tablePrefix: '' };
  id = DomainSchema.Int;
  name = {
    type: String,
    searchText: true
  };
}

export const CustomerSchema = new DomainSchema(Customer);
