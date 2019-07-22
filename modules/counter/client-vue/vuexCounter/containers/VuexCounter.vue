<template>
  <CounterSection>
    <p>
      Current count, is {{ count }}. This is being stored client-side with Vuex.
    </p>
    <Button variant='primary' size='md' v-on:click='increment()'>
      Increate Vuex counter
    </Button>
  </CounterSection>
</template>

<script lang='ts'>
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';

import { Button } from '@gqlapp/look-client-vue';

import CounterSection from '../../containers/CounterSection.vue';
import { INCREMENT } from '../reducers';

export default Vue.extend({
  components: {
    Button,
    CounterSection
  },
  computed: mapState({
    count: ({ counter }) => counter.count
  }),
  methods: mapMutations({
    increment: INCREMENT
  })
});
</script>
