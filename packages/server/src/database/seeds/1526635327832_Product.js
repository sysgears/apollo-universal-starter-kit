import { returnId, truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['product', 'category', 'product_type']);

  const [product_type_id] = await returnId(knex('product_type').insert({ name: 'S', description: 'Small', rank: 1 }));
  await returnId(knex('product_type').insert({ name: 'M', description: 'Medum', rank: 2 }));
  await returnId(knex('product_type').insert({ name: 'L', description: 'Large', rank: 3 }));

  const [category_id] = await returnId(knex('category').insert({ name: 'Textiles', parent_id: null }));
  await returnId(knex('category').insert({ name: 'Shoes', parent_id: category_id }));
  await returnId(knex('category').insert({ name: 'Hats', parent_id: category_id }));
  await returnId(knex('category').insert({ name: 'Bags', parent_id: category_id }));

  await returnId(
    knex('product').insert({
      name: 'T-Shirt',
      category_id,
      product_type_id,
      price: 10,
      release_date: '2018-01-01',
      display: true
    })
  );
}
