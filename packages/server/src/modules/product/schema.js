import DomainSchema, { Schema } from '@domain-schema/core';

export class Category extends Schema {
  __ = { name: 'Category', tablePrefix: '' };
  id = DomainSchema.Int;
  name = {
    type: String,
    searchText: true,
    min: 3
  };
  parent = {
    type: Category,
    external: true,
    optional: true,
    blackbox: true
  };
  products = {
    type: [Product],
    optional: true,
    external: true
  };
}

export class ProductType extends Schema {
  __ = {
    name: 'ProductType',
    tablePrefix: '',
    __toString: ({ name, description }) => (description ? `${name} (${description})` : name)
  };
  id = DomainSchema.Int;
  name = {
    type: String,
    searchText: true
  };
  description = {
    type: String,
    searchText: true,
    optional: true
  };
  rank = {
    type: DomainSchema.Int,
    show: false,
    optional: true
  };
}

export class Product extends Schema {
  __ = { name: 'Product', tablePrefix: '' };
  id = DomainSchema.Int;
  name = {
    type: String,
    searchText: true
  };
  category = {
    type: Category,
    external: true
  };
  productType = {
    type: ProductType,
    optional: true,
    external: true
  };
  price = {
    type: DomainSchema.Float,
    fieldInput: 'price'
  };
  releaseDate = {
    type: Date,
    optional: true
  };
  display = {
    type: Boolean,
    optional: true
  };
}

export const ProductSchema = new DomainSchema(Product);
