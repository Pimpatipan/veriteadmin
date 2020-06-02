<template>
  <div class="panel d-flex align-items-md-center">
    <b-form-checkbox size="lg" :v-model="value" v-on:change="onDataChange">{{text}}</b-form-checkbox>
  </div>
</template>

<script>
export default {
  name: "input-check-box",
  props: {
    text: {
      required: false,
      type: String
    }, 
  },
  data(){
    return{ 
      value: 1
    } 
  },
  methods: {
    onDataChange(value) {
      this.$emit("change", value);
    }
  }
};
</script>

<style scoped>
.panel {
  font-size: 17px;
  color: #16274a;
}
::v-deep .custom-control-label::before {
  border-radius: 0 !important;
}
::v-deep .custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: #bcbcbc;
  background-color: #16274a;
  border-radius: 0;
}
::v-deep
  .custom-control-input:focus:not(:checked)
  ~ .custom-control-label::before {
  cursor: pointer !important;
  border-color: #bcbcbc;
}
::v-deep .custom-control-input:focus ~ .custom-control-label::before {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
::v-deep .custom-checkbox.b-custom-control-lg > label,
::v-deep .input-group-lg .custom-checkbox > label {
  font-size: 17px;
  color: #16274a;
  line-height: 24px;
}
::v-deep .custom-checkbox.b-custom-control-lg .custom-control-label::before,
::v-deep .input-group-lg .custom-checkbox .custom-control-label::before,
::v-deep .custom-checkbox.b-custom-control-lg .custom-control-label::after, 
::v-deep .input-group-lg .custom-checkbox .custom-control-label::after {
  top: 3px;
}
</style>
