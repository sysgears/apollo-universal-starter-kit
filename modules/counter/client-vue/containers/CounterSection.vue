<template>
  <section class='section'>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'Section',
};
</script>

<style>
  .section {
    margin-bottom: 30px;
    text-align: center;
  }
</style>
