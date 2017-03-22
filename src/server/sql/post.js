import knex from './connector'
import _ from 'lodash';

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
  getPosts() {
    return knex
      .select('id', 'title', 'content')
      .from('post');
  }

  getCommentsForPostIds(postIds) {
    return knex
      .select('id', 'content', 'post_id AS postId')
      .from('comment')
      .whereIn('post_id', postIds).then( res => {
        return orderedFor(res, postIds, 'postId', false);
      } );
  }
}
