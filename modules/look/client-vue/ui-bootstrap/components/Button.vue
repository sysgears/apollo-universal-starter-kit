<template>
  <b-button :size=size :variant=variant @click=click>
    <slot></slot>
  </b-button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    size: String,
    variant: String,
  },
  methods: {
    click(e) {
      this.$emit('click', e);
    }
  }
};
</script>
