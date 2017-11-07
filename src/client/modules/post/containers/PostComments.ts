import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs/Subject';

import * as ADD_COMMENT from '../graphql/AddComment.graphql';
import * as COMMENT_SUBSCRIPTION from '../graphql/CommentSubscription.graphql';
import * as DELETE_COMMENT from '../graphql/DeleteComment.graphql';
import * as EDIT_COMMENT from '../graphql/EditComment.graphql';

export const AddComment = (prev: any, addComment: any) => {
  if (prev) {
    if (addComment.id !== null && prev.comments.some((comment: any) => addComment.id === comment.id)) {
      return prev;
    }

    return {
      ...prev,
      comments: [...prev.comments, addComment]
    };
  }
};

export const UpdateComment = (prev: any, updatedComment: any) => {
  if (prev) {
    const post = JSON.parse(JSON.stringify(prev));
    const currentComment = post.comments.find((comment: any) => comment.id === updatedComment.id);
    if (currentComment) {
      const index = post.comments.indexOf(currentComment);
      if (index) {
        post.comments.splice(index, 1, updatedComment);
      }
    }

    return post;
  }
};

export const DeleteComment = (prev: any, id: any) => {
  if (prev) {
    const index = prev.comments.findIndex((x: any) => x.id === id);
    if (index < 0) {
      return prev;
    }

    return {
      ...prev,
      comments: prev.comments.filter((comment: any) => comment.id !== id)
    };
  }
};

@Injectable()
export default class PostCommentsService {
  public startedEditing = new Subject<any>();

  constructor(private apollo: Apollo) {}

  public subscribeToCommentList(postId: number) {
    return this.apollo.subscribe({
      query: COMMENT_SUBSCRIPTION,
      variables: { postId }
    });
  }

  public addComment(content: string, postId: number) {
    return this.apollo.mutate({
      mutation: ADD_COMMENT,
      variables: {
        input: { content, postId }
      },
      optimisticResponse: {
        addComment: {
          id: -1,
          content,
          __typename: 'Comment'
        }
      },
      updateQueries: {
        post: (prev: any, { mutationResult: { data: { addComment } } }: any) => {
          if (prev.post) {
            // ignore if duplicate
            if (addComment.id !== null && prev.post.comments.some((comment: any) => addComment.id === comment.id)) {
              return prev;
            }

            return {
              post: {
                ...prev.post,
                comments: [...prev.post.comments, addComment]
              }
            };
          }
        }
      }
    });
  }

  public editComment(id: number, postId: number, content: string) {
    return this.apollo.mutate({
      mutation: EDIT_COMMENT,
      variables: {
        input: { id, postId, content }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        editComment: {
          id,
          content,
          __typename: 'Comment'
        }
      }
    });
  }

  public deleteComment(id: number, postId: number) {
    return this.apollo.mutate({
      mutation: DELETE_COMMENT,
      variables: {
        input: { id, postId }
      },
      optimisticResponse: {
        __typename: 'Mutation',
        deleteComment: {
          id,
          __typename: 'Comment'
        }
      },
      updateQueries: {
        post: (prev: any, { mutationResult: { data: { deleteComment } } }: any) => {
          if (prev.post) {
            const index = prev.post.comments.findIndex((x: any) => x.id === deleteComment.id);
            // ignore if not found
            if (index < 0) {
              return prev;
            }

            return {
              post: {
                ...prev.post,
                comments: prev.post.comments.filter((comment: any) => comment.id !== deleteComment.id)
              }
            };
          }
        }
      }
    });
  }
}
