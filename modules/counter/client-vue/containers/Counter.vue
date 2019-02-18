<template>
  <page-layout>
    <div v-for='counter in counters' :key=counter.cid>
      <component v-bind:is=counter></component>
    </div>
  </page-layout>
</template>

<script lang='ts'>
import Vue from 'vue';

import { PageLayout } from '@gqlapp/look-client-vue';

import counters from '../counters';

export default Vue.extend({
  components: {
    PageLayout
  },
  data: () => ({
    counters: counters.counterComponent
  })
});
</script>
