import DomainSchema, { Schema } from 'domain-schema';

/* eslint import/prefer-default-export: 0 */

export const $Module$ = new DomainSchema(
  class $Module$ extends Schema {
    id = DomainSchema.Integer;
    name = {
      type: String
    };
  }
);
