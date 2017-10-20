import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import * as ADD_POST from '../graphql/AddPost.graphql';
import * as EDIT_POST from '../graphql/EditPost.graphql';
import * as POST_QUERY from '../graphql/PostQuery.graphql';
import { AddPost } from './Post';

@Injectable()
export default class PostEditService {
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
        posts: AddPost
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
