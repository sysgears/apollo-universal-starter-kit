import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import * as CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';

@Injectable()
export default class ProfileService {
  constructor(private apollo: Apollo) {}

  public getCurrentUser(cb: (result: Observable<any>) => any) {
    const currentUser = this.apollo.watchQuery({
      query: CURRENT_USER_QUERY
    });
    return this.subscribe(currentUser, cb);
  }

  private subscribe(observable: Observable<any>, cb: (result: Observable<any>) => any): Subscription {
    const subscription = observable.subscribe({
      next: result => {
        try {
          cb(result);
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
// /*eslint-disable no-unused-vars*/
// // React
// import React from 'react';
// import PropTypes from 'prop-types';
//
// // Apollo
// import { graphql, compose } from 'react-apollo';
//
// // Components
// import ProfileView from '../components/ProfileView';
//
// import CURRENT_USER_QUERY from '../graphql/CurrentUserQuery.graphql';
//
// class Profile extends React.Component {
//   render() {
//     return <ProfileView {...this.props} />;
//   }
// }
//
// Profile.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   currentUser: PropTypes.object
// };
//
// export default compose(
//   graphql(CURRENT_USER_QUERY, {
//     options: { fetchPolicy: 'network-only' },
//     props({ data: { loading, currentUser } }) {
//       return { loading, currentUser };
//     }
//   })
// )(Profile);
