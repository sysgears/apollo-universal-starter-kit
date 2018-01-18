import { assign } from 'lodash';

import * as COUNTER_QUERY_CLIENT from '../graphql/CounterQuery_client.graphql';

const counterState = {
  counter: 1,
  __typename: 'CounterState'
};

export default {
  resolvers: {
    Query: {
      counterState: () => counterState
    },
    Mutation: {
      updateCounterState: (some: any, { counter }: any, { cache }: any): any => {
        const data = {
          counterState: assign({}, counterState, { counter })
        };
        /*
        // This is another approach of manipulating data with the apollo-link-state
        // It can be useful in the case when you do not need to change the whole
        // object or it is costly
        const id = '$ROOT_QUERY.counterState';
        const fragment = gql`
            fragment incrementCounter on CounterState {
                counter
            }
        `;
        cache.writeFragment({ fragment: fragment, id: id, data: data.counterState });
        */
        cache.writeQuery({ query: COUNTER_QUERY_CLIENT, data });
        return data;
      }
    }
  }
};
