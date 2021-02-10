<template>
  <b-modal
    id="changeAddressModal"
    ref="changeAddressModal"
    hide-header
    hide-footer
    no-close-on-backdrop
    centered
    body-class="p-4"
  >
    <div class="modal-header border-0 px-0 pt-0">
      <HeaderLine text="Address Book" class="w-100" />
      <button
        type="button"
        aria-label="Close"
        class="close"
        @click="$bvModal.hide('changeAddressModal')"
      >×</button>
    </div>
    <div>
      <b-container class="p-0">
        <b-row>
          <b-col md="6">
            <InputText
              textFloat="Name"
              placeholder="Name"
              type="text"
              name="name"
              v-model="addressDetail.firstname"
              v-bind:isValidate="$v.addressDetail.firstname.$error"
              :v="$v.addressDetail.firstname"
              isRequired
            />
          </b-col>
          <b-col md="6">
            <InputText
              textFloat="Lastname"
              placeholder="Lastname"
              type="text"
              name="lastname"
              v-model="addressDetail.lastname"
              v-bind:isValidate="$v.addressDetail.lastname.$error"
              :v="$v.addressDetail.lastname"
              isRequired
            />
          </b-col>
        </b-row>

        <b-row>
          <b-col>
            <InputTextArea
              textFloat="Address"
              placeholder="Address"
              type="text"
              name="addressdetail"
              isRequired
              v-model="addressDetail.address"
              v-bind:isValidate="$v.addressDetail.address.$error"
              :v="$v.addressDetail.address"
            />
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <InputSelect
              class="mb-4"
              title="Province"
              name="province"
              v-bind:options="list.provinces"
              v-on:onDataChange="handleChangeProvince"
              v-model="addressDetail.provinceId"
              isRequired
              v-bind:isValidate="$v.addressDetail.provinceId.$error"
              :v="$v.addressDetail.provinceId"
            />
          </b-col>
          <b-col md="6">
            <InputSelect
              title="District"
              name="district"
              v-bind:options="list.districts"
              v-on:onDataChange="handleChangeDistrict"
              v-model="addressDetail.districtId"
              isRequired
              v-bind:isValidate="$v.addressDetail.districtId.$error"
              :v="$v.addressDetail.districtId"
            />
          </b-col>
        </b-row>

        <b-row>
          <b-col md="6">
            <InputSelect
              class="mb-4"
              title="Subdistrict"
              name="subdistrict"
              v-bind:options="list.subDistricts"
              v-on:onDataChange="handleChangeSubDistrict"
              v-model="addressDetail.subdistrictId"
              isRequired
              v-bind:isValidate="$v.addressDetail.subdistrictId.$error"
              :v="$v.addressDetail.subdistrictId"
            />
          </b-col>
          <b-col md="6">
            <InputText
              textFloat="Zip Code"
              placeholder="Zip Code"
              type="text"
              name="zipcode"
              isRequired
              v-model="addressDetail.code"
              :disabled="true"
              v-bind:isValidate="$v.addressDetail.zipCodeId.$error"
              :v="$v.addressDetail.zipCodeId"
            />
          </b-col>
        </b-row>

        <b-row v-if="addressDetail.addressTypeId == 2">
          <b-col>
            <InputText
              textFloat="Tax ID"
              placeholder="Tax ID"
              type="text"
              name="tax"
              v-model="addressDetail.tax"
            />
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div class="text-center mt-3">
      <b-button class="btn btn-main" @click="saveAddress">Save</b-button>
    </div>
  </b-modal>
</template>


<script>
import InputSelect from "@/components/inputs/InputSelect";
import InputText from "@/components/inputs/InputText";
import { required, numeric, minValue } from "vuelidate/lib/validators";
import InputTextArea from "@/components/inputs/InputTextArea";
import HeaderLine from "@/components/HeaderLine";

export default {
  components: {
    InputSelect,
    InputText,
    InputTextArea,
    HeaderLine
  },
  props: {
    isValidate: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      errortxt: "",
      addressDetail: {
        provinceId: 0,
        districtId: 0,
        subdistrictId: 0,
        zipCodeId: 0,
        id: 0,
        code: null,
        name: null,
        userGUID: null,
        defaultBilling: false,
        defaultShipping: false,
        firstname: null,
        lastname: null,
        address: null,
        tax: null
      },
      list: {
        provinces: [],
        districts: [{ value: 0, text:"Please select District" }],
        subDistricts: [
          { value: 0, text: "Please select Sub-District" }
        ]
      }
    };
  },
  validations: {
    addressDetail: {
      districtId: {
        required,
        numeric,
        minValue: minValue(1)
      },
      subdistrictId: {
        required,
        numeric,
        minValue: minValue(1)
      },
      provinceId: {
        required,
        numeric,
        minValue: minValue(1)
      },
      zipCodeId: {
        required,
        numeric,
        minValue: minValue(1)
      },
      address: { required },
      firstname: { required },
      lastname: { required }
    }
  },
  methods: {
    show: async function(data) {
      this.addressDetail = data;
      await this.loadDataProvinces();

      await this.handleChangeProvince(
        this.addressDetail.provinceId,
        this.addressDetail.districtId,
        this.addressDetail.subdistrictId
      );

      await this.handleChangeDistrict(
        this.addressDetail.districtId,
        this.addressDetail.subdistrictId
      );

      await this.handleChangeSubDistrict(this.addressDetail.subdistrictId);
      await this.setZipCode(this.addressDetail.subdistrictId);

      this.$v.addressDetail.$reset();
      this.$refs["changeAddressModal"].show();
    },

    hide() {
      this.$refs["changeAddressModal"].hide();
    },
    loadDataProvinces: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/address/province`,
        null,
        this.$headers,
        null
      );
      let list = [{ value: 0, text: "Please select Province" }];
      let provinces = data.detail;
      provinces = provinces.map(obj => {
        return {
          value: obj.id,
          text: obj.name
        };
      });
      this.list.provinces = list.concat(provinces);
    },
    setZipCode: async function(subdistrictId = 0) {
      if (subdistrictId) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/zipcode/${subdistrictId}`,
          null,
          this.$headers,
          null
        );

        this.addressDetail.code = data.detail.name;
        this.addressDetail.zipCodeId = data.detail.id;
      } else {
        this.addressDetail.code = "";
        this.addressDetail.zipCodeId = 0;
      }
    },
    handleChangeSubDistrict: async function(value, zipCodeId = "") {
      this.addressDetail.subdistrictId = value;
      await this.setZipCode(this.addressDetail.subdistrictId);
    },
    handleChangeDistrict: async function(value, subdistrictId = 0) {
      this.addressDetail.districtId = value;
      this.addressDetail.subdistrictName = "";

      let list = [{ value: 0, text: "Please select District" }];
      let subDistricts = [];
      if (value) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/subdistrict/${this.addressDetail.districtId}`,
          null,
          this.$headers,
          null
        );
        subDistricts = data.detail;
        subDistricts = subDistricts.map(obj => {
          return {
            value: obj.id,
            text: obj.name
          };
        });
      }
      this.list.subDistricts = await list.concat(subDistricts);
      this.addressDetail.subdistrictId = subdistrictId;
      await this.setZipCode(this.addressDetail.subdistrictId);
    },
    handleChangeProvince: async function(
      value,
      districtId = 0,
      subdistrictId = 0
    ) {
      this.addressDetail.provinceId = value;
      // this.addressDetail.districtId = "";
      // this.addressDetail.subdistrictId = "";

      let list = [{ value: 0, text: "Please select District" }];
      let districts = [];
      if (value) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/district/${this.addressDetail.provinceId}`,
          null,
          this.$headers,
          null
        );
        districts = data.detail;
        districts = districts.map(obj => {
          return {
            value: obj.id,
            text: obj.name
          };
        });
      }
      this.list.districts = await list.concat(districts);
      this.addressDetail.districtId = districtId;
      this.addressDetail.subdistrictId = subdistrictId;
      await this.setZipCode(this.addressDetail.subdistrictId);
    },
    saveAddress: async function() {
      this.$v.addressDetail.$touch();
      if (this.$v.addressDetail.$error) {
        return;
      }

      let addressData = {
        orderId: this.addressDetail.orderId,
        addressTypeId: this.addressDetail.addressTypeId,
        name: this.addressDetail.name,
        firstname: this.addressDetail.firstname,
        lastname: this.addressDetail.lastname,
        address: this.addressDetail.address,
        zipCodeId: this.addressDetail.zipCodeId,
        tax: this.addressDetail.tax
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/UpdateOrderAddress`,
        null,
        this.$headers,
        addressData
      );

      if (data.result == 1) {
        this.$refs["changeAddressModal"].hide();
        this.$emit("getList");
      }
    }
  }
};
</script>