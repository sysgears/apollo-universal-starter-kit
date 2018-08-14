import { returnId, orderedFor } from '../../sql/helpers';
import knex from '../../sql/connector';

interface PostItem {
  id: number;
  title: string;
  content: string;
}

interface CommentItem {
  id: number;
  post_id: string;
  content: string;
}

interface PostModel {
  postsPagination(limit: number, after: number): Promise<PostItem[]>;
  getCommentsForPostIds(postIds: number[]): Promise<CommentItem[]>;
  getTotal(): Promise<number>;
  post(id: number): Promise<PostItem>;
  addPost(inputPost: { title: string; content: string }): Promise<number>;
  deletePost(id: number): Promise<number>;
  editPost(post: PostItem): Promise<number>;
  addComment(inputComment: { content: string; postId: number }): Promise<number>;
  getComment(id: number): Promise<CommentItem>;
  deleteComment(id: number): Promise<number>;
  editComment(editedComment: { id: number; content: string }): Promise<number>;
}

export default class Post implements PostModel {
  public postsPagination(limit: number, after: number) {
    return knex
      .select('id', 'title', 'content')
      .from('post')
      .orderBy('id', 'desc')
      .limit(limit)
      .offset(after);
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
      .countDistinct('id as count')
      .first();
  }

  public post(id: number) {
    return knex
      .select('id', 'title', 'content')
      .from('post')
      .where('id', '=', id)
      .first();
  }

  public addPost({ title, content }: { title: string; content: string }) {
    return returnId(knex('post')).insert({ title, content });
  }

  public deletePost(id: number) {
    return knex('post')
      .where('id', '=', id)
      .del();
  }

  public editPost({ id, title, content }: PostItem) {
    return knex('post')
      .where('id', '=', id)
      .update({ title, content });
  }

  public addComment({ content, postId }: { content: string; postId: number }) {
    return returnId(knex('comment')).insert({ content, post_id: postId });
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

  public editComment({ id, content }: { id: number; content: string }) {
    return knex('comment')
      .where('id', '=', id)
      .update({
        content
      });
  }
}
