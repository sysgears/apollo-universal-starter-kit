import knex from './connector'
import _ from 'lodash';

const orderedFor = (rows, collection, field, singleObject) => {
  // return the rows ordered for the collection
  const inGroupsOfField = _.groupBy(rows, field);
  return collection.map(element => {
    const elementArray = inGroupsOfField[ element ];
    if (elementArray) {
      return singleObject ? elementArray[ 0 ] : elementArray;
    }
    return singleObject ? {} : [];
  });
};

export default class Post {
  getPostsPagination(first, after) {
    return knex
      .select('id', 'title', 'content')
      .from('post')
      .where('id', '>', after)
      .limit(first);
  }

  getCommentsForPostIds(postIds) {
    return knex
      .select('id', 'content', 'post_id AS postId')
      .from('comment')
      .whereIn('post_id', postIds).then(res => {
        return orderedFor(res, postIds, 'postId', false);
      });
  }

  getTotal() {
    return knex('post').count('id as count').first();
  }

  getNextPageFlag(id) {
    return knex('post').count('id as count').where('id', '>', id).first();
  }


  getPost(id) {
    return knex
      .select('id', 'title', 'content')
      .from('post')
      .where('id', '=', id)
      .first();
  }
}
