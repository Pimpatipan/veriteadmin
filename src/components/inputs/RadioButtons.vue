<template>
  <div class="input-radio" v-bind:class="{ 'active' : data == dataValue }">
    <b-form-radio
      class="radio-input"
      type="radio"
      :value="dataValue"
      @change="onDataChange"
    >
      <p class="text-float">{{textFloat}}</p>
      <p class="text-detail">{{text}}</p>
    </b-form-radio>
  </div>
</template>

<script>
export default {
  props: {
    textFloat: {
      required: true,
      type: String
    },
    text: {
      required: true,
      type: String
    },
    dataValue: {
      required: true,
      type: String
    },
    data: {
      required: true,
      type: String | Number
    }
  },
  data() {
    return {
      // checked : false,
    };
  },
  methods: {
    onDataChange(event) {
      this.$emit("onDataChange", event);
    }
  }
};
</script>

<style scoped>
.input-radio {
  background-color: #f8f8f8;
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 20px 25px;
  font-family: "Kanit-Medium";
  border: 2px solid #f8f8f8 !important;
  white-space: nowrap;
}
.text-float {
  font-family: "Kanit-Medium";
  color: #24252a;
  margin-bottom: 0px;
}
.text-detail {
  font-family: "Kanit-Regular";
  color: #24252a;
  font-size: 0.75rem;
  margin-bottom: 0px;
}
input[type="radio"]:checked:focus-within,
.input-radio.active,
.input-radio:focus-within {
  border-color: #afce38 !important;
}
::v-deep .custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: #afce38;
  background-color: #afce38;
}
::v-deep .custom-control-label::before,
::v-deep .custom-control-label::after {
  cursor: pointer;
  top: 15px;
}
::v-deep .custom-control-input:focus ~ .custom-control-label::before {
  -webkit-box-shadow: 0 0 0 0.2rem rgba(175, 206, 56, 0.25);
  box-shadow: 0 0 0 0.2rem rgba(175, 206, 56, 0.25);
}
</style>

