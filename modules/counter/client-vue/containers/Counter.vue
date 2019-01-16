<template>
  <!-- TODO: Replace div with PageLayout component -->
  <div>
    <div v-for='counter in counters' :key=counter.name>
      <component v-bind:is=counter></component>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import counters from '../counters';

export default {
  name: 'CounterContainer',
  data: () => ({
    counters: counters.counterComponent.map(component => component)
  }),
};
</script>
