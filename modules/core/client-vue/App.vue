<template>
    <div id='root' :key=frontendReloadCount ref='root'>
      <router-view></router-view>
    </div>
</template>
<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  props: {
    frontendReloadCount: Number
  },
  methods: {
    reloadFrontend() {
      this.frontendReloadCount += 1;
    }
  }
});
</script>