import DomainSchema, { Schema } from '@domain-schema/core';

export class $Module$ extends Schema {
  constructor() {
    super();
    this.__ = { name: '$Module$', tablePrefix: '' };
    this.id = DomainSchema.Int;
    this.name = {
      type: String
    };
  }
}

export const $Module$Schema = new DomainSchema($Module$);
