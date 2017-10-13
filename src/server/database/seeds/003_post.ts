import * as Knex from 'knex';

import truncateTables from '../../../common/db';

export const seed = async (knex: Knex, Promise: any) => {
  await truncateTables(knex, ['post', 'comment']);

  await Promise.all(
    Array.from(new Array(20).keys()).map(async ii => {
      const post = await knex('post')
        .returning('id')
        .insert({
          title: `Post title ${ii + 1}`,
          content: `Post content ${ii + 1}`
        });

      await Promise.all(
        Array.from(new Array(2).keys()).map(async jj => {
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
};
