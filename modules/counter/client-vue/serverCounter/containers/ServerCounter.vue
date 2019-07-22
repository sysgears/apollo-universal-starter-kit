<template>
  <CounterSection>
    <p>
      The current counter value is {{ serverCounter.amount }}. It's stored in the database and uses Apollo subscription for real-time updates.
    </p>
    <IncrementCounter :counter=serverCounter />
  </CounterSection>
</template>

<script lang='ts'>
import Vue from 'vue';

import { COUNTER_QUERY, COUNTER_SUBSCRIPTION } from '@gqlapp/counter-common';

import IncrementCounter from '../components/IncrementCounter.vue';
import CounterSection from '../../containers/CounterSection.vue';

export default Vue.extend({
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
          }: any
        ) {
          this.serverCounter.amount = amount;
        }
      }
    }
  }
});
</script>
