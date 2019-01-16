<template>
  <div>
    <div v-if=error>
      <RedBox :error=error />
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
  import RedBox from './RedBox';

  class ServerError extends Error {
    constructor(error) {
      Object.keys(error).forEach(key => {
        this[ key ] = error[ key ];
      });

      this.name = 'ServerError';
    }
  }

  // https://gist.github.com/dillonchanis/3883105d0e6fda2ed9c100d4a494b2a3#file-errorboundary-js
  export default {
    name: 'ErrorBoundary',
    components: {
      RedBox,
    },
    data: () => ({
      error: null,
      info: null,
    }),
    beforeMount() {
      if (window.__SERVER_ERROR__) {
        this.error = new ServerError(window.__SERVER_ERROR__);
      }
    },
    errorCaptured(err, vm, info = '') {
      this.$emit('errorCaptured', { err, vm, info });
      this.error = err;
      this.info = info;

      // stopPropagation
      return false;
    },
    mounted() {
      console.log(`============= mounted ${this.error ? 'with' : 'without'} errors`)
    },
  }
</script>
