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
    external: true,
    blackbox: true
  };
  subCategories = {
    type: [SubCategory],
    blackbox: true,
    optional: true,
    external: true
  };
}

export class SubCategory extends Schema {
  __ = {
    name: 'SubCategory',
    tablePrefix: ''
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
  category = {
    type: Category,
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
    searchText: true,
    input: {
      label: 'Name',
      placeholder: 'Name'
    }
  };
  category = {
    type: Category,
    external: true,
    optional: true,
    input: {
      label: 'Category',
      placeholder: 'Category'
    }
  };
  productType = {
    type: ProductType,
    optional: true,
    external: true,
    input: {
      label: 'Product Type',
      placeholder: 'Product Type'
    }
  };
  price = {
    type: DomainSchema.Float,
    fieldType: 'number',
    input: {
      label: 'Price',
      placeholder: 'Price'
    }
  };
  releaseDate = {
    type: Date,
    optional: true,
    fieldType: 'date',
    input: {
      label: 'Release Date',
      placeholder: 'Release Date'
    }
  };
  display = {
    type: Boolean,
    optional: true,
    fieldType: 'checkbox',
    input: {
      label: 'Display'
    }
  };
}

export const ProductSchema = new DomainSchema(Product);
