<template>
  <section class='section'>
    <slot></slot>
  </section>
</template>

<script lang='ts'>
export default {
  name: 'Section'
};
</script>

<style>
  .section {
    margin-bottom: 30px;
    text-align: center;
  }
</style>
