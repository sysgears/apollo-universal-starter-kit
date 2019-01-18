<template>
  <CounterSection>
    <p>
      Current count, is {{ count }}. This is being stored client-side with Vuex.
    </p>
    <LookButton variant='primary' size='md' v-on:click='increment()'>
      Click to increase count
    </LookButton>
  </CounterSection>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { Button as LookButton } from '@module/look-client-vue';
import CounterSection from '../../containers/CounterSection.vue';
import { INCREMENT } from '../reducers';

export default {
  name: 'VuexCounter',
  components: {
    LookButton,
    CounterSection,
  },
  computed: mapState({
    count: ({ counter }) => counter.count
  }),
  methods: mapMutations({
    increment: INCREMENT
  }),
};
</script>
