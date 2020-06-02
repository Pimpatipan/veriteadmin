<template>
  <div class="sidebar-header text-uppercase">{{text}}</div>
</template>

<script>
export default {
  props: {
    text: {
      required: true,
      type: String
    }
  }
};
</script>

<style scoped>
.sidebar-header {
  padding: 13px 16px 10px;
  font-size: 16px;
}
</style>