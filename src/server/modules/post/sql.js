import _ from 'lodash';
import knex from '../../sql/connector';

const orderedFor = (rows, collection, field, singleObject) => {
  // return the rows ordered for the collection
  const inGroupsOfField = _.groupBy(rows, field);
  return collection.map(element => {
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return singleObject ? elementArray[0] : elementArray;
    }
    return singleObject ? {} : [];
  });
};

export default class Post {
  postsPagination(limit, after) {
    let where = '';
    if (after > 0) {
      where = `id < ${after}`;
    }

    return knex
      .select('id', 'title', 'content')
      .from('post')
      .whereRaw(where)
      .orderBy('id', 'desc')
      .limit(limit);
  }

  async getCommentsForPostIds(postIds) {
    let res = await knex
      .select('id', 'content', 'post_id AS postId')
      .from('comment')
      .whereIn('post_id', postIds);

    return orderedFor(res, postIds, 'postId', false);
  }

  getTotal() {
    return knex('post')
      .count('id as count')
      .first();
  }

  getNextPageFlag(id) {
    return knex('post')
      .count('id as count')
      .where('id', '<', id)
      .first();
  }

  post(id) {
    return knex
      .select('id', 'title', 'content')
      .from('post')
      .where('id', '=', id)
      .first();
  }

  addPost({ title, content }) {
    return knex('post')
      .insert({ title, content })
      .returning('id');
  }

  deletePost(id) {
    return knex('post')
      .where('id', '=', id)
      .del();
  }

  editPost({ id, title, content }) {
    return knex('post')
      .where('id', '=', id)
      .update({
        title: title,
        content: content
      });
  }

  addComment({ content, postId }) {
    return knex('comment')
      .insert({ content, post_id: postId })
      .returning('id');
  }

  getComment(id) {
    return knex
      .select('id', 'content')
      .from('comment')
      .where('id', '=', id)
      .first();
  }

  deleteComment(id) {
    return knex('comment')
      .where('id', '=', id)
      .del();
  }

  editComment({ id, content }) {
    return knex('comment')
      .where('id', '=', id)
      .update({
        content: content
      });
  }
}
