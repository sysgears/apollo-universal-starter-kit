import DomainSchema from '@domain-schema/core';
import { ProductType } from '../product/schema';

//eslint-disable-next-line import/prefer-default-export
export const ProductTypeSchema = new DomainSchema(ProductType);
