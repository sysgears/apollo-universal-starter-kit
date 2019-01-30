<template>
  <article class='d-flex flex-column flex-grow-1'>
    <section class='d-flex flex-column flex-grow-1 flex-shrink-0'>
      <header class='d-flex flex-column'>

      </header>
      <b-container id='content'>
        <slot></slot>
      </b-container>
    </section>
    <footer class='d-flex flex-shrink-0 justify-content-center'>
      <span>&copy; {{ now }}</span>
    </footer>
  </article>
</template>

<script lang="ts">
import Footer from './Footer.vue';
import settings from '../../../../../settings';

export default {
  name: 'PageLayout',
  components: {
    Footer,
  },
  computed: {
    now() {
      return `${new Date().getFullYear()}. ${settings.app.name}.`;
    }
  },
};
</script>
