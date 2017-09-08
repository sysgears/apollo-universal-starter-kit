/*
For DB's other than SQLite you'll have to use raw queries for truncation if there is a foreign key constraint in your table.

Instead of 
await Promise.all([
  knex('post').truncate(),
  knex('comment').truncate()
]);

Use
await Promise.all([
  knex.raw('ALTER SEQUENCE post_id_seq RESTART WITH 1'),
  knex.raw('ALTER SEQUENCE comment_id_seq RESTART WITH 1'),
  knex.raw('TRUNCATE TABLE post CASCADE'),
  knex.raw('TRUNCATE TABLE comment CASCADE'),
]);
*/

export async function seed(knex, Promise) {
  await Promise.all([knex('post').truncate(), knex('comment').truncate()]);

  await Promise.all(
    [...Array(20).keys()].map(async ii => {
      const post = await knex('post')
        .returning('id')
        .insert({
          title: `Post title ${ii + 1}`,
          content: `Post content ${ii + 1}`
        });

      await Promise.all(
        [...Array(2).keys()].map(async jj => {
          return knex('comment')
            .returning('id')
            .insert({
              post_id: post[0],
              content: `Comment title ${jj + 1} for post ${post[0]}`
            });
        })
      );
    })
  );
}
