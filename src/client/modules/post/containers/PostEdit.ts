import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import * as ADD_POST from '../graphql/AddPost.graphql';
import * as EDIT_POST from '../graphql/EditPost.graphql';
import * as POST_QUERY from '../graphql/PostQuery.graphql';

@Injectable()
export class PostEditService {
  constructor(private apollo: Apollo) {}

  public getPost(id: number) {
    return this.apollo.watchQuery({
      query: POST_QUERY,
      variables: { id }
    });
  }

  public addPost(title: string, content: string) {
    return this.apollo.mutate({
      mutation: ADD_POST,
      variables: { input: { title, content } },
      optimisticResponse: {
        addPost: {
          id: -1,
          title,
          content,
          comments: [],
          __typename: 'Post'
        }
      },
      updateQueries: {
        posts: (prev, { mutationResult: { data: { addPost } } }) => {
          // ignore if duplicate
          if (addPost.id !== null && prev.posts.edges.some((post: any) => addPost.id === post.cursor)) {
            return prev;
          }

          const edge = {
            cursor: addPost.id,
            node: addPost,
            __typename: 'PostEdges'
          };

          return {
            posts: {
              ...prev.posts,
              totalCount: prev.posts.totalCount + 1,
              edges: [edge, ...prev.posts.edges]
            }
          };
        }
      }
    });
  }

  public editPost(id: number, title: string, content: string) {
    return this.apollo.mutate({
      mutation: EDIT_POST,
      variables: {
        input: { id, title, content }
      }
    });
  }
}
