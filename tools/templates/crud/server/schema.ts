import DomainSchema, { Schema } from '@domain-schema/core';

export class $Module$ extends Schema {
  public id: any;
  public name: object;
  constructor() {
    super();
    this.__ = { name: '$Module$', tablePrefix: '' };
    this.id = DomainSchema.Int;
    this.name = {
      type: String,
      searchText: true
    };
  }
}

export const $Module$Schema = new DomainSchema($Module$);
