<template>
  <page-layout>
    <div v-for='counter in counters' :key=counter.name>
      <component v-bind:is=counter></component>
    </div>
  </page-layout>
</template>

<script>
import Vue from 'vue';
import counters from '../counters';
import { PageLayout } from '@module/look-client-vue';

export default {
  name: 'CounterContainer',
  components: {
    PageLayout,
  },
  data: () => ({
    counters: counters.counterComponent.map(component => component)
  }),
};
</script>
