<template>
  <div id='root'>
    <ErrorBoundary>
      <router-view></router-view>
    </ErrorBoundary>
  </div>
</template>

<script>
import ErrorBoundary from './ErrorBoundary.vue';

export default {
  name: 'App',
  components: {
    ErrorBoundary,
  },
}
</script>
