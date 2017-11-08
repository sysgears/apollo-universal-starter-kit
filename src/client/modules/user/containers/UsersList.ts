import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import * as DELETE_USER from '../graphql/DeleteUser.graphql';
import * as USERS_QUERY from '../graphql/UsersQuery.graphql';

@Injectable()
export default class UsersListService {
  constructor(private apollo: Apollo) {}

  public getUsers(orderBy: any, searchText: string, role: string, isActive: boolean) {
    return this.apollo.watchQuery({
      query: USERS_QUERY,
      fetchPolicy: 'cache-and-network',
      variables: {
        orderBy,
        filter: { searchText, role, isActive }
      }
    });
  }

  public deleteUser(id: number) {
    return this.apollo.mutate({
      mutation: DELETE_USER,
      variables: { id },
      refetchQueries: [`users`]
    });
  }
}
