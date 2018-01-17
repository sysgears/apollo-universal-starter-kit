import gql from 'graphql-tag';
import { assign } from 'lodash';

const TYPE_NAME = 'CounterState';
const counterState = {
  counter: 1,
  __typename: TYPE_NAME
};

export default {
  resolvers: {
    Query: {
      counterState: () => counterState
    },
    Mutation: {
      updateCounterState: (some: any, { counter }: any, { cache }: any): any => {
        const id = `$ROOT_QUERY.${TYPE_NAME}`;
        /*
                const fragment = gql`fragment incrementCounter on CounterState { counter }`;
                data['counter']++;
                let data = cache.readFragment({ fragment, id });
                cache.writeFragment({ fragment, id, data });
        */
        const query = gql`
          query GetCounter {
            counterState @client {
              counter
            }
          }
        `;
        const data = {
          counterState: assign({}, counterState, { counter })
        };
        cache.writeQuery({ query, id, data });
        return data;
      }
    }
  }
};
