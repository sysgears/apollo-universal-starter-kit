import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as ADD_POST from '../graphql/AddPost.graphql';
import * as EDIT_POST from '../graphql/EditPost.graphql';
import * as POST_QUERY from '../graphql/PostQuery.graphql';

@Injectable()
export default class PostEditService {
  constructor(private apollo: Apollo) {}

  public getPost(id: number, callback: (result: any) => any) {
    const getPostQuery = this.apollo.watchQuery({
      query: POST_QUERY,
      variables: { id }
    });
    return this.subscribe(getPostQuery, callback);
  }

  public addPost(title: string, content: string, callback: (result: any) => any) {
    const addPostQuery = this.apollo.mutate({
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
      }
    });
    return this.subscribe(addPostQuery, callback);
  }

  public editPost(id: number, title: string, content: string, callback: (result: any) => any) {
    const editPostQuery = this.apollo.mutate({
      mutation: EDIT_POST,
      variables: {
        input: { id, title, content }
      }
    });
    return this.subscribe(editPostQuery, callback);
  }

  private subscribe(observable: Observable<any>, cb?: (result: Observable<any>) => any): Subscription {
    const subscription = observable.subscribe({
      next: result => {
        try {
          if (cb) {
            cb(result);
          }
        } catch (e) {
          setImmediate(() => {
            subscription.unsubscribe();
          });
        }
      }
    });
    return subscription;
  }
}
