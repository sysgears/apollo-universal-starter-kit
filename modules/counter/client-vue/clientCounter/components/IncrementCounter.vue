<template>
  <button @click='increment()'>Increase server counter</button>
</template>

<script>
import { ADD_COUNTER_CLIENT } from '@module/counter-common';

export default {
  methods: {
    increment() {
      this.$apollo.mutate({
        mutation: ADD_COUNTER_CLIENT,
        variables: { amount: 1 },
        error(error) {
          console.error(`Error: ${error}`)
        },
      });
    }
  }
};
</script>
