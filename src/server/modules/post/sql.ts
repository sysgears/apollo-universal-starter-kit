import { Raw } from 'knex';
import * as _ from 'lodash';
import { knex } from '../../sql/connector';

const orderedFor = (rows: Raw[], collection: any[], field: string, singleObject: boolean) => {
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

export class Post {
  public postsPagination(limit: number, after: number) {
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

  public async getCommentsForPostIds(postIds: number[]) {
    const res = await knex
      .select('id', 'content', 'post_id AS postId')
      .from('comment')
      .whereIn('post_id', postIds);

    return orderedFor(res, postIds, 'postId', false);
  }

  public getTotal() {
    return knex('post')
      .count('id as count')
      .first();
  }

  public getNextPageFlag(id: number) {
    return knex('post')
      .count('id as count')
      .where('id', '<', id)
      .first();
  }

  public post(id: number) {
    return knex
      .select('id', 'title', 'content')
      .from('post')
      .where('id', '=', id)
      .first();
  }

  public addPost(input: PostInput) {
    return knex('post')
      .insert(input)
      .returning('id');
  }

  public deletePost(id: number) {
    return knex('post')
      .where('id', '=', id)
      .del();
  }

  public editPost(input: PostInput) {
    return knex('post')
      .where('id', '=', input.id)
      .update({
        title: input.title,
        content: input.content
      });
  }

  public addComment(input: PostInput) {
    return knex('comment')
      .insert({ content: input.content, post_id: input.postId })
      .returning('id');
  }

  public getComment(id: number) {
    return knex
      .select('id', 'content')
      .from('comment')
      .where('id', '=', id)
      .first();
  }

  public deleteComment(id: number) {
    return knex('comment')
      .where('id', '=', id)
      .del();
  }

  public editComment(input: PostInput) {
    return knex('comment')
      .where('id', '=', input.id)
      .update({
        content: input.content
      });
  }
}
