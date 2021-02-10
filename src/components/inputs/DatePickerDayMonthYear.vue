<template>
  <div :class="['select-custom', { error: v.$error }]">
    <label>
      {{textFloat}}
      <span v-if="isRequired" class="text-danger">*</span>
    </label>
    <div class="d-flex">
      <b-form-select
        :size="size"
        :class="['btn-select', {error: $v.date.month.value.$error}]"
        v-model="date.day"
        ref="month"
        @change="handleChangeDay"
      >
        <b-form-select-option
          v-for="(item, key) in list.day"
          v-bind:key="key"
          :name="`${name}-day`"
          :value="item"
        >{{item.text}}</b-form-select-option>
      </b-form-select>
      <b-form-select
        :size="size"
        :class="['btn-select mx-3', {error: $v.date.month.value.$error}]"
        v-model="date.month"
        ref="year"
        @change="handleChangeMonth"
      >
        <b-form-select-option
          v-for="(item, key) in list.month"
          v-bind:key="key"
          :name="`${name}-month`"
          :value="item"
          :disabled="date.day.value > item.days && item.days != 0"
        >{{item.text}}</b-form-select-option>
      </b-form-select>
      <b-form-select
        :size="size"
        :class="['btn-select', {error: $v.date.month.value.$error}]"
        v-model="date.year"
        ref="year"
        @change="$v.$reset()"
      >
        <b-form-select-option
          v-for="(item, key) in list.year"
          v-bind:key="key"
          :name="`${name}-year`"
          :value="item"
          :disabled="date.month.value == 2 && date.day.value == 29 && (item.value % 4 == 0 && !item.value % 100 == 0 && !item.value % 400 == 0 ) == false"
        >{{item.text}}</b-form-select-option>
      </b-form-select>
    </div>
    <span v-if="detail" class="text-desc">{{detail}}</span>
    <div v-if="v && v.$error">
      <span class="text-error">{{$t('pleaseCheckTryAgain')}}</span>
    </div>
  </div>
</template>

<script>
import { required, minValue, integer } from "vuelidate/lib/validators";
import * as moment from "moment/moment";

export default {
  props: {
    textFloat: {
      required: true,
      type: String
    },
    detail: {
      required: false,
      type: String
    },
    size: {
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
    isRequired: {
      required: false,
      type: Boolean
    },
    v: {
      required: false,
      type: Object
    }
  },
  validations: {
    date: {
      day: {
        value: {
          required,
          integer,
          minValue: minValue(0)
        }
      },
      month: {
        value: {
          required,
          integer,
          minValue: minValue(0)
        }
      },
      year: {
        value: {
          required,
          integer,
          minValue: minValue(0)
        }
      }
    }
  },
  data() {
    return {
      date: {
        day: { value: 0, text: "Day" },
        month: { value: 0, text: "Month", days: 0 },
        year: { value: 0, text: "Year" }
      },
      list: {
        day: [
          { value: 0, text: "Day" },
          { value: 1, text: "01" },
          { value: 2, text: "02" },
          { value: 3, text: "03" },
          { value: 4, text: "04" },
          { value: 5, text: "05" },
          { value: 6, text: "06" },
          { value: 7, text: "07" },
          { value: 8, text: "08" },
          { value: 9, text: "09" },
          { value: 10, text: "10" },
          { value: 11, text: "11" },
          { value: 12, text: "12" },
          { value: 13, text: "13" },
          { value: 14, text: "14" },
          { value: 15, text: "15" },
          { value: 16, text: "16" },
          { value: 17, text: "17" },
          { value: 18, text: "18" },
          { value: 19, text: "19" },
          { value: 20, text: "20" },
          { value: 21, text: "21" },
          { value: 22, text: "22" },
          { value: 23, text: "23" },
          { value: 24, text: "24" },
          { value: 25, text: "25" },
          { value: 26, text: "26" },
          { value: 27, text: "27" },
          { value: 28, text: "28" },
          { value: 29, text: "29" },
          { value: 30, text: "30" },
          { value: 31, text: "31" }
        ],
        month: [
          { value: 0, text: "Month", days: 0 },
          { value: 1, text: "January", days: 31 },
          { value: 2, text: "February", days: 29 },
          { value: 3, text: "March", days: 31 },
          { value: 4, text: "April", days: 30 },
          { value: 5, text: "May", days: 31 },
          { value: 6, text: "June", days: 30 },
          { value: 7, text: "July", days: 31 },
          { value: 8, text: "August", days: 31 },
          { value: 9, text: "September", days: 30 },
          { value: 10, text: "October", days: 31 },
          { value: 11, text: "November", days: 30 },
          { value: 12, text: "Necember", days: 31 }
        ],
        year: [{ value: 0, text: "Year" }]
      }
    };
  },
  created: async function() {
    let year = parseInt(moment(new Date()).format("YYYY"));
    for (var i = year; i > year - 100; i--) {
      this.list.year.push({ value: i, text: i });
    }

    if (this.value && this.value != "0001-01-01T00:00:00") {
      let date = moment(this.value);
      this.date.day = this.list.day.filter(
        ele => ele.value == date.format("DD")
      )[0];
      this.date.month = this.list.month.filter(
        ele => ele.value == date.format("MM")
      )[0];
      this.date.year = {
        value: date.format("YYYY"),
        text: date.format("YYYY")
      };
    }
  },
  methods: {
    onDataChange() {
      let date = "";
      if (
        this.date.day.value &&
        this.date.month.value &&
        this.date.year.value
      ) {
        let day = this.date.day.text;
        let month =
          this.date.month.value < 10
            ? `0${this.date.month.value}`
            : this.date.month.value;
        date =
          moment(`${this.date.year.value}-${month}-${day}`).format(
            "YYYY-MM-DD"
          ) + "T00:00:00.000Z";
      }
      this.$emit("onDataChange", date);
    },
    focus() {
      this.$refs.input.focus();
    },
    handleChangeDay(val) {
      this.$v.$reset();
      if (val.value > this.date.month.days)
        this.date.month = { value: 0, text: "Month", days: 0 };

      if (
        val.value == 29 &&
        this.date.month.value == 2 &&
        (this.date.year.value % 4 == 0 &&
          !this.date.year.value % 100 == 0 &&
          !this.date.year.value % 400 == 0) == false
      )
        this.date.year = { value: 0, text: "Year" };
    },
    handleChangeMonth(val) {
      this.$v.$reset();
      if (
        this.date.day.value == 29 &&
        val.value == 2 &&
        (this.date.year.value % 4 == 0 &&
          !this.date.year.value % 100 == 0 &&
          !this.date.year.value % 400 == 0) == false
      )
        this.date.year = { value: 0, text: "Year" };
    }
  },
  watch: {
    "date.day.value": function() {
      this.onDataChange();
    },
    "date.month.value": function() {
      this.onDataChange();
    },
    "date.year.value": function() {
      this.onDataChange();
    }
  }
};
</script>

<style scoped>
.select-custom {
  margin-bottom: 15px;
  position: relative;
  white-space: nowrap;
}
.select-custom.error .btn-select,
.select-custom .btn-select.error {
  border-color: red !important;
}
.select-custom > label {
  color: #16274a;
  font-size: 17px;
  margin-bottom: 2px;
}
::v-deep .btn-select {
  color: #16274a;
  background-color: white;
  border: 1px solid #bcbcbc;
  border-radius: 0px;
  padding: 5px 10px;
  cursor: pointer;
}
::v-deep .btn-select.custom-select-lg {
  height: 45px;
  font-size: 1rem;
}
::v-deep .btn-select:focus {
  border-color: #16274a;
}
::v-deep .btn-select > option {
  background-color: white;
  color: #16274a;
}
::v-deep .btn-select > option:checked {
  background-color: #16274a !important;
  color: white !important;
}
::v-deep .btn-select:focus {
  box-shadow: unset !important;
}
.text-error {
  color: #ff0000;
  font-size: 14px;
}
@media (max-width: 767.98px) {
  .select-custom {
    margin-top: 0;
  }
  .select-custom > label {
    font-size: 15px;
  }
}
</style>

