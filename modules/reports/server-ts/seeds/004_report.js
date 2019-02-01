import { returnId, truncateTables } from '@gqlapp/database-server-ts';

const CONTACTS = [
  { name: 'Tom Jackson', phone: '555-444-333', email: 'tom@gmail.com' },
  { name: 'Mike James', phone: '555-777-888', email: 'mikejames@gmail.com' },
  { name: 'Janet Larson', phone: '555-222-111', email: 'janetlarson@gmail.com' },
  { name: 'Clark Thompson', phone: '555-444-333', email: 'clark123@gmail.com' },
  { name: 'Emma Page', phone: '555-444-333', email: 'emma1page@gmail.com' }
];

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['report']);
  for (let i of CONTACTS) {
    await returnId(knex('report')).insert({
      name: i.name,
      phone: i.phone,
      email: i.email
    });
  }
}
