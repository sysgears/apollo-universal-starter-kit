<template>
    <div>
        <p>Current count, is {{count}}. This is being stored client-side with Vuex.</p>
        <button @click=this.increment>Click to increase count</button>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { INCREMENT } from '../reducers';

export default {
    name: 'VuexCounter',
    computed: mapState({
        count: ({ counter }) => counter.count,
    }),
    methods: mapMutations({
        increment: INCREMENT,
    }),
};
</script>
