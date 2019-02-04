<template>
  <Button variant='primary' size='md' v-on:click='increment()'>
    Increase server counter
  </Button>
</template>

<script lang='ts'>
import Vue from 'vue';
import { ApolloCache } from 'apollo-cache';
import { ADD_COUNTER, COUNTER_QUERY } from '@gqlapp/counter-common';
import { Button } from '@gqlapp/look-client-vue';

export default Vue.extend({
  props: { counter: Object },
  components: {
    Button
  },
  methods: {
    increment() {
      this.$apollo.mutate({
        mutation: ADD_COUNTER,
        variables: { amount: 1 },
        update(
          cache: ApolloCache<any>,
          {
            data: {
              addServerCounter: { amount }
            }
          }: any
        ) {
          cache.writeQuery({
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
        }
      });
    }
  }
});
</script>
