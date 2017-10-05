import * as knex from 'knex';
import _ = require('lodash');
import db from '../../sql/connector';

const orderedFor = (rows: knex.Raw[], collection: any[], field: string, singleObject: boolean) => {
  // return the rows ordered for the collection
  const inGroupsOfField = _.groupBy(rows, field);
  return collection.map((element: any) => {
    const elementArray = inGroupsOfField[element];
    if (elementArray) {
      return singleObject ? elementArray[0] : elementArray;
    }
    return singleObject ? {} : [];
  });
};

export interface PostInput {
  id?: number;
  title?: string;
  content?: string;
  postId?: number;
}

export default class Post {
  public getPostsPagination(limit: number, after: number) {
    let where = '';
    if (after > 0) {
      where = `id < ${after}`;
    }

    return db
      .select('id', 'title', 'content')
      .from('post')
      .whereRaw(where)
      .orderBy('id', 'desc')
      .limit(limit);
  }

  public async getCommentsForPostIds(postIds: number[]) {
    const res = await db
      .select('id', 'content', 'post_id AS postId')
      .from('comment')
      .whereIn('post_id', postIds);

    return orderedFor(res, postIds, 'postId', false);
  }

  public getTotal() {
    return db('post')
      .count('id as count')
      .first();
  }

  public getNextPageFlag(id: number) {
    return db('post')
      .count('id as count')
      .where('id', '<', id)
      .first();
  }

  public getPost(id: number) {
    return db
      .select('id', 'title', 'content')
      .from('post')
      .where('id', '=', id)
      .first();
  }

  public addPost(input: PostInput) {
    return db('post')
      .insert(input)
      .returning('id');
  }

  public deletePost(id: number) {
    return db('post')
      .where('id', '=', id)
      .del();
  }

  public editPost(input: PostInput) {
    return db('post')
      .where('id', '=', input.id)
      .update({
        title: input.title,
        content: input.content
      });
  }

  public addComment(input: PostInput) {
    return db('comment')
      .insert({ content: input.content, post_id: input.postId })
      .returning('id');
  }

  public getComment(id: number) {
    return db
      .select('id', 'content')
      .from('comment')
      .where('id', '=', id)
      .first();
  }

  public deleteComment(id: number) {
    return db('comment')
      .where('id', '=', id)
      .del();
  }

  public editComment(input: PostInput) {
    return db('comment')
      .where('id', '=', input.id)
      .update({
        content: input.content
      });
  }
}
