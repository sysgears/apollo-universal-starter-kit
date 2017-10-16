import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as ADD_COUNTER from '../graphql/AddCounter.graphql';
import * as COUNTER_QUERY from '../graphql/CounterQuery.graphql';
import * as COUNTER_SUBSCRIPTION from '../graphql/CounterQuery.graphql';

export function updateQuery(prev: any, mutationResult: any) {
  const newCounter = mutationResult.subscriptionData.data.counter;
  return {
    ...prev,
    counter: newCounter
  };
}

@Injectable()
export class CounterService {
  constructor(private apollo: Apollo) {}

  public subscribeToCount(callback: (result: any) => any) {
    const subscription = this.apollo.subscribe({
      query: COUNTER_SUBSCRIPTION,
      variables: {}
    });
    return this.subscribe(subscription, callback);
  }

  public getCounter(callback: (result: any) => any) {
    const getCounter = this.apollo.query({ query: COUNTER_QUERY });
    return this.subscribe(getCounter, callback);
  }

  public addCounter(amount: number, callback: (result: any) => any) {
    const addCounter = this.apollo.mutate({
      mutation: ADD_COUNTER,
      variables: { amount },
      updateQueries: { updateQuery }
    });
    return this.subscribe(addCounter, callback);
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

// import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { graphql, compose } from 'react-apollo';
// import update from 'immutability-helper';
//
// import CounterView from '../components/CounterView';
//
// import COUNTER_QUERY from '../graphql/CounterQuery.graphql';
// import ADD_COUNTER from '../graphql/AddCounter.graphql';
// import COUNTER_SUBSCRIPTION from '../graphql/CounterSubscription.graphql';
//
// class Counter extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.subscription = null;
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (!nextProps.loading) {
//       // Subscribe or re-subscribe
//       if (!this.subscription) {
//         this.subscribeToCount();
//       }
//     }
//   }
//
//   componentWillUnmount() {
//     if (this.subscription) {
//       this.subscription();
//     }
//   }
//
//   subscribeToCount() {
//     const { subscribeToMore } = this.props;
//     this.subscription = subscribeToMore({
//       document: COUNTER_SUBSCRIPTION,
//       variables: {},
//       updateQuery: (prev, { subscriptionData: { data: { counterUpdated: { amount } } } }) => {
//         return update(prev, {
//           counter: {
//             amount: {
//               $set: amount
//             }
//           }
//         });
//       }
//     });
//   }
//
//   render() {
//     return <CounterView {...this.props} />;
//   }
// }
//
// Counter.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   counter: PropTypes.object,
//   updateCountQuery: PropTypes.func,
//   onReduxIncrement: PropTypes.func,
//   addCounter: PropTypes.func.isRequired,
//   subscribeToMore: PropTypes.func.isRequired,
//   reduxCount: PropTypes.number.isRequired
// };
//
// const CounterWithApollo = compose(
//   graphql(COUNTER_QUERY, {
//     props({ data: { loading, counter, subscribeToMore } }) {
//       return { loading, counter, subscribeToMore };
//     }
//   }),
//   graphql(ADD_COUNTER, {
//     props: ({ ownProps, mutate }) => ({
//       addCounter(amount) {
//         return () =>
//           mutate({
//             variables: { amount },
//             updateQueries: {
//               counterQuery: (prev, { mutationResult }) => {
//                 const newAmount = mutationResult.data.addCounter.amount;
//                 return update(prev, {
//                   counter: {
//                     amount: {
//                       $set: newAmount
//                     }
//                   }
//                 });
//               }
//             },
//             optimisticResponse: {
//               __typename: 'Mutation',
//               addCounter: {
//                 __typename: 'Counter',
//                 amount: ownProps.counter.amount + 1
//               }
//             }
//           });
//       }
//     })
//   })
// )(Counter);
//
// export default connect(
//   state => ({ reduxCount: state.counter.reduxCount }),
//   dispatch => ({
//     onReduxIncrement(value) {
//       return () =>
//         dispatch({
//           type: 'COUNTER_INCREMENT',
//           value: Number(value)
//         });
//     }
//   })
// )(CounterWithApollo);
