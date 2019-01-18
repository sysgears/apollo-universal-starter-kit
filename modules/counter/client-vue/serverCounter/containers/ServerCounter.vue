<template>
  <div>
    <p>
      The current counter value is {{ serverCounter.amount }}. It's stored in the database and uses Apollo subscription for real-time updates.
    </p>
    <IncrementCounter :counter=serverCounter />
  </div>
</template>

<script>
import { COUNTER_QUERY, COUNTER_SUBSCRIPTION } from '@module/counter-common';
import IncrementCounter from '../components/IncrementCounter.vue';

export default {
  name: 'ServerCounter',
  components: { IncrementCounter },
  data: () => ({
    serverCounter: {
      amount: 0,
    }
  }),
  apollo: {
    serverCounter: {
      query: COUNTER_QUERY,
      subscribeToMore: {
        document: COUNTER_SUBSCRIPTION,
        updateQuery(prevStore, { subscriptionData: { data : { counterUpdated: { amount }}}}) {
          this.serverCounter.amount = amount;
        },
      },
      error(error) {
        console.error(`Error: ${error}`);
      },
    }
  }
};
</script>
