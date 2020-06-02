<template>
  <div>
    <b-form-group class="panel">
      <b-form-radio-group plain @change="handleChange" v-model="form.selected">
        <label v-for="(item, key) in list" v-bind:key="key" class="panel-option">
          <b-form-radio :value="item.value">
            <div class="d-flex align-items-center">
              <font-awesome-icon v-if="item.value==1" icon="home" class="icon-place align-middle" />
              <font-awesome-icon
                v-else-if="item.value==2"
                icon="building"
                class="icon-place align-middle"
              />
              <font-awesome-icon
                v-else-if="item.value==3"
                icon="hotel"
                class="icon-place align-middle"
              />
              <p class="name-place">{{item.name}}</p>
            </div>
          </b-form-radio>
        </label>
      </b-form-radio-group>
    </b-form-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: false,
      type: Number
    }
  },
  data() {
    return {
       form: {
        selected: this.value,
        name: ""
      },
      list: [
        {
          value: 1,
          name: "Home"
        },
        {
          value: 2,
          name: "Office"
        },
        {
          value: 3,
          name: "Other"
        }
      ]
    };
  },
  methods: {
    handleChange(ele) {
      this.$emit("handleOptionAddress", ele);
    }
  },
  created: function() {
    this.$emit("handleOptionAddress", 1);
  }
};
</script>

<style scoped>
.name-place {
  margin-bottom: 0;
  font-weight: bold;
}
.panel-option {
  margin-bottom: 0;
  margin-right: 15px;
  padding: 15px;
  border: 1px solid #16274a;
  border-radius: 10px;
  cursor: pointer;
}
.icon-place {
  margin-right: 10px;
}
@media (max-width: 991.98px) {
  .panel {
    margin-bottom: 5px;
  }
  .panel-option {
    margin-bottom: 5px;
    margin-right: 5px;
    padding: 8px;
  }
  .panel-option:last-child {
    margin-right: 0px;
  }
  .form-check-inline {
    margin-right: 0px;
  }
  .icon-place {
    margin-right: 5px;
    font-size: 14px;
  }
  ::v-deep .form-check-inline .form-check-input {
    margin-right: 5px;
  }
  .name-place {
    font-size: 14px;
  }
}
@media (max-width: 600px) {
  .name-place {
    font-size: 12px;
  }
}
</style>
