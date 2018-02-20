import DomainSchema, { Schema } from '@domain-schema/core';

export class $Module$ extends Schema {
  __ = { name: '$Module$', tablePrefix: '' };
  id = DomainSchema.Int;
  name = {
    type: String,
    searchText: true
  };
}

export const $Module$Schema = new DomainSchema($Module$);
