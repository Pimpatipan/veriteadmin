<template>
  <div class="d-flex w-100 align-items-center mb-1">
    <span class="title-rate text-right">{{name}}</span>
    <b-progress :value="data.percent" :max="max" class="flex-grow-1 custom-progress"></b-progress>
    <span class="title-rate">{{data.number | numeral('0,0')}}</span>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      required: true,
      type: Object | Array
    },
    name: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      max: 100
    };
  }
};
</script>

<style scoped>
.title-rate {
  width: 45px;
  color: #c9b67e;
  font-size: 9px;
}
.custom-progress {
  margin: 0 10px;
  height: 5px;
}
::v-deep .custom-progress .progress-bar {
  background-color: #c9b67e;
}
@media (max-width: 991.98px) {
  .title-rate {
    width: auto;
  }
  .custom-progress {
    margin: 0 5px;
  }
}
</style>
