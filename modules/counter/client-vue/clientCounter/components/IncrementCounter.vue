<template>
  <Button variant='primary' size='md' v-on:click='increment()'>
    Increase Apollo Link State counter
  </Button>
</template>

<script lang='ts'>
import Vue from 'vue';
import { ADD_COUNTER_CLIENT } from '@gqlapp/counter-common';
import { Button } from '@gqlapp/look-client-vue';

export default Vue.extend({
  components: {
    Button
  },
  methods: {
    increment() {
      this.$apollo.mutate({
        mutation: ADD_COUNTER_CLIENT,
        variables: { amount: 1 }
      });
    }
  }
});
</script>
