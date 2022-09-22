<script>
export default {
  props: ["kind"],
  data() {
    return {
      kind: `alert-${this.$props.kind || "info"}`,
    };
  },
};
</script>

<template>
  <div class="alert" :class="[kind]">
    <slot />
  </div>
</template>

<style scoped>
.alert {
  padding: 20px;
  background: white;
  border-radius: 3px;
  color: white;
}
.alert-info {
  background: #5352ed;
}
.alert-success {
  background: #2ed573;
}
.alert-error {
  background: #ff4757;
}
.alert-warning {
  background: #ffa502;
}
</style>
