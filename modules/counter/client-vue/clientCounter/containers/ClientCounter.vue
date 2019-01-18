<template>
  <div>
    <p>
      The current counter value is {{ clientCounter.amount }}. It's stored on the client with Apollo Link State.
    </p>
    <IncrementCounter />
  </div>
</template>

<script>
import { COUNTER_QUERY_CLIENT } from '@module/counter-common';
import IncrementCounter from '../components/IncrementCounter.vue';

export default {
  name: 'ClientCounter',
  components: { IncrementCounter },
  data: () => ({
    clientCounter: {
      amount: 0,
    },
  }),
  apollo: {
    clientCounter: {
      query: COUNTER_QUERY_CLIENT,
    },
  },
};
</script>
