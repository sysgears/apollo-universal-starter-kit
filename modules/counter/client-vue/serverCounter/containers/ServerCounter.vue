<template>
  <CounterSection>
    <p>
      The current counter value is {{ serverCounter.amount }}. It's stored in the database and uses Apollo subscription for real-time updates.
    </p>
    <IncrementCounter :counter=serverCounter />
  </CounterSection>
</template>

<script lang='ts'>
import { COUNTER_QUERY, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

import IncrementCounter from '../components/IncrementCounter.vue';
import CounterSection from '../../containers/CounterSection.vue';

export default {
  name: 'ServerCounter',
  components: {
    IncrementCounter,
    CounterSection
  },
  data: () => ({
    serverCounter: {
      amount: 0
    }
  }),
  apollo: {
    serverCounter: {
      query: COUNTER_QUERY,
      subscribeToMore: {
        document: COUNTER_SUBSCRIPTION,
        updateQuery(
          prevStore: any,
          {
            subscriptionData: {
              data: {
                counterUpdated: { amount }
              }
            }
          }
        ) {
          this.serverCounter.amount = amount;
        }
      }
    }
  }
};
</script>
