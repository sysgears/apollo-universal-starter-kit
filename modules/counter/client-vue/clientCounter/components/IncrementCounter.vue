<template>
  <LookButton variant='primary' size='md' v-on:click='increment()'>
    Increase server counter
  </LookButton>
</template>

<script>
import { ADD_COUNTER_CLIENT } from '@gqlapp/counter-common';
import { Button as LookButton } from '@gqlapp/look-client-vue';

export default {
  components: {
    LookButton,
  },
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
