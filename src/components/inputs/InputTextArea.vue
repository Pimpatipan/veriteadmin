<template>
  <div class="div-input">
    <div class="display-only" v-if="isDisplay"></div>
    <div :class="['input-custom', { error: isValidate }]">
      <label>
        {{textFloat}}
        <span v-if="isRequired" class="text-danger">*</span>
      </label>
      <textarea
        :class="['custom-input']"
        :placeholder="placeholder"
        :name="name"
        :rows="rows"
        :required="required"
        :value="value"
        @input="$emit('input', $event.target.value)"
        @change="onDataChange"
        @keyup="$emit('onKeyup', $event)"
      ></textarea>
    </div>
    <img :src="img" alt="logo-lang" v-if="img" class="logo-lang" />
    <span v-if="detail" class="text-desc pl-2">{{detail}}</span>
    <div v-if="v && v.$error">
      <span class="text-error" v-if="v.required == false">This field can’t be empty</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    textFloat: {
      required: true,
      type: String
    },
    placeholder: {
      required: true,
      type: String
    },
    required: {
      required: false,
      type: Boolean
    },
    detail: {
      required: false,
      type: String
    },
    name: {
      required: false,
      type: String
    },
    value: {
      required: false,
      type: String | Number
    },
    rows: {
      required: false,
      type: String | Number
    },
    isDisplay: {
      required: false,
      type: Boolean
    },
    isRequired: {
      required: false,
      type: Boolean
    },
    isValidate: {
      required: false,
      type: Boolean
    },
    v: {
      required: false,
      type: Object
    },
    img: {
      required: false,
      type: String
    }
  },
  methods: {
    onDataChange(event) {
      this.$emit("onDataChange", event.target.value);
    }
  }
};
</script>

<style scoped>
.div-input {
  margin-bottom: 15px;
  position: relative;
  white-space: nowrap;
}
.input-custom {
  padding: 0px;
}
.input-custom > label {
  color: #16274a;
  font-size: 16px;
  margin-bottom: 2px;
  font-weight: bold;
}
.input-custom > textarea {
  color: #16274a;
  background-color: white;
  border: 1px solid #bcbcbc;
  border-radius: 0px;
  padding: 5px 10px;
}
.input-custom > textarea:focus {
  border: 1px solid #16274a;
}
.input-custom.error > textarea {
  border-color: red !important;
}
::-webkit-input-placeholder {
  /* Edge */
  color: rgba(22, 39, 74, 0.4);
}
:-ms-input-placeholder {
  /* Internet Explorer */
  color: rgba(22, 39, 74, 0.4);
}
::placeholder {
  color: rgba(22, 39, 74, 0.4);
}
.custom-input {
  display: block;
  border: none;
  width: 100%;
}
.text-desc {
  color: #16274a;
  font-size: 0.8rem;
  font-family: "Kanit-Light";
}
.display-only {
  position: absolute;
  z-index: 5000;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.text-error {
  color: #ff0000;
  font-size: 14px;
}
@media (max-width: 767.98px) {
  /* .div-input {
    margin-top: 0;
  } */
  .input-custom > label {
    font-size: 15px;
  }
}
</style>

