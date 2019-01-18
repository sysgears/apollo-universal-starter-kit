<template>
  <button @click='increment()'>Increase Apollo Link State counter</button>
</template>

<script>
import { ADD_COUNTER, COUNTER_QUERY } from '@module/counter-common';

export default {
  props: { counter: Object },
  methods: {
    increment: function() {
      this.$apollo.mutate({
        mutation: ADD_COUNTER,
        variables: { amount: 1 },
        update(RoutingCache, { data : { addServerCounter : { amount }}}) {
          RoutingCache.writeQuery({
            query: COUNTER_QUERY,
            data: {
              serverCounter: {
                amount,
                __typename: 'Counter'
              }
            }
          });
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addServerCounter: {
            __typename: 'Counter',
            amount: this.counter.amount + 1
          }
        },
        error(error) {
          console.error(`Error: ${error}`)
        },
      });
    }
  },
};
</script>
