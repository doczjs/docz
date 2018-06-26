<template>
  <div class="alert">
    <slot></slot>
    {{ kind }}
  </div>
</template>

<script>
  export default {
    name: 'Alert',
    props: {
      kind: {
        type: String,
        default: 'info'
      }
    },
  }
</script>

<style scoped>
  .alert {
    background-color: grey;
  }
</style>
