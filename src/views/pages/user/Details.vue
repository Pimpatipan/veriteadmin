<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">User Details</h1>
          </b-col>
        </b-row>
        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4 vh-100" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>

          <b-col class="px-4 px-sm-5 py-4" v-else>
            <HeaderLine text="Profile" class="mb-3" />
            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Name"
                  placeholder="Name"
                  type="text"
                  name="name"
                  v-model="customer.userProfile.firstname"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Lastname"
                  placeholder="Lastname"
                  type="text"
                  name="lastname"
                  v-model="customer.userProfile.lastname"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <span :class="['verified-txt', verifiedColor]">{{
                  verifiedTxt
                }}</span>
                <InputText
                  textFloat="Email"
                  placeholder="Name"
                  type="text"
                  name="email"
                  isRequired
                  v-model="customer.userProfile.email"
                  :v="$v.customer.userProfile.email"
                  :isValidate="$v.customer.userProfile.email.$error"
                />
                <button
                  class="m-0 text-right text-secondary reset-pass pointer"
                  v-if="id != 0"
                  @click="resetPass"
                  :disabled="isReset"
                >
                  {{ isReset ? "Loading..." : "Reset New Password" }}
                </button>
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Telephone No."
                  placeholder="Telephone No."
                  type="text"
                  name="telno"
                  v-model="customer.userProfile.telephone"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <!-- <label class="label-text">Birthday</label>
                <datetime
                  v-model="customer.userProfile.birthday"
                  placeholder="Please select date"
                  class="date-picker"
                  format="dd/MM/yyyy"
                  value-zone="local"
                ></datetime>-->

                <DatePickerDayMonthYear
                  textFloat="Birthday"
                  v-model="customer.userProfile.birthday"
                  name="birthday"
                  isRequired
                  :v="$v.customer.userProfile.birthday"
                  v-on:onDataChange="
                    (val) => (customer.userProfile.birthday = val)
                  "
                />
              </b-col>
              <b-col md="6">
                <label class="label-text mb-2">Gender</label>
                <b-row class="mb-3 mb-sm-0">
                  <b-col md="4" class="mb-1 mb-sm-0">
                    <b-form-radio
                      v-model="customer.userProfile.genderId"
                      name="some-radios"
                      value="1"
                      >Male</b-form-radio
                    >
                  </b-col>
                  <b-col md="4" class="mb-1 mb-sm-0">
                    <b-form-radio
                      v-model="customer.userProfile.genderId"
                      name="some-radios"
                      value="2"
                      >Female</b-form-radio
                    >
                  </b-col>
                  <b-col md="4">
                    <b-form-radio
                      v-model="customer.userProfile.genderId"
                      name="some-radios"
                      value="3"
                      >N/A</b-form-radio
                    >
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Password"
                  placeholder="Password"
                  type="password"
                  name="name"
                  isRequired
                  v-model="customer.userProfile.password"
                  :isValidate="$v.customer.userProfile.password.$error"
                  :v="$v.customer.userProfile.password"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Confirm Password"
                  placeholder="Confirm Password"
                  type="password"
                  name="lastname"
                  isRequired
                  v-model="customer.userProfile.confirmPassword"
                  :isValidate="$v.customer.userProfile.confirmPassword.$error"
                  :v="$v.customer.userProfile.confirmPassword"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputSelect
                  class="mb-4"
                  title="Channel"
                  name="channel"
                  v-bind:options="channels"
                  valueField="id"
                  textField="name"
                  v-model="customer.userProfile.channelId"
                  v-on:onDataChange="handleChangeChannel"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Other Details"
                  placeholder="Other Details"
                  type="text"
                  name="Other"
                  v-model="customer.userProfile.otherDetail"
                  v-if="customer.userProfile.channelId == 6"
                />
              </b-col>
            </b-row>

            <b-row class="">
              <b-col>
                <label class="font-weight-bold main-label">
                  Subscribe
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="customer.userProfile.isSubscribe"
                    class="radio-active"
                    size="lg"
                  >
                    <span class="ml-2 main-label">{{
                      customer.userProfile.isSubscribe
                        ? "Subscribed"
                        : "Not Subscribed"
                    }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <div v-if="id != 0" class="mt-3">
              <HeaderLine text="Address" class="mb-3" />

              <div v-if="customer.userAddressList.length != 0">
                <div
                  v-for="(item, index) in customer.userAddressList"
                  v-bind:key="index"
                >
                  <b-row class="mb-3">
                    <b-col cols="6" sm="10">
                      <div class="d-sm-flex mb-3 mb-sm-0">
                        <p class="font-weight-bold mr-2">{{ item.name }}</p>
                        <p
                          v-if="item.defaultBilling == true"
                          class="text-secondary mb-0 mx-1 wrap-normal"
                        >
                          ( Default Receipt Address )
                        </p>
                        <p
                          v-if="item.defaultShipping == true"
                          class="text-secondary mb-0 mx-1 wrap-normal"
                        >
                          ( Default Shipping Address )
                        </p>
                      </div>
                    </b-col>
                    <b-col cols="6" sm="2" class="text-right">
                      <span
                        class="text-underline my-0 mr-3 text-underline pointer"
                        @click="editAddress(item.id)"
                        >Edit</span
                      >
                      <span
                        class="text-underline m-0 pointer"
                        @click="deleteAddress(item.id)"
                        >Delete</span
                      >
                    </b-col>
                    <b-col>
                      <p>
                        {{ item.address }} {{ item.subdistrict }}
                        {{ item.district }} {{ item.province }} {{ item.code }}
                      </p>
                    </b-col>
                  </b-row>
                  <hr />
                </div>
              </div>
              <div v-else class="text-center">
                <h1 class="my-5 text-secondary">No Data Found</h1>
              </div>

              <div class="text-center">
                <b-button class="my-3" variant="primary" @click="editAddress(0)"
                  >+ Add New Address</b-button
                >
              </div>

              <HeaderLine text="Transaction" class="mb-3" />

              <div>
                <b-table
                  striped
                  responsive
                  hover
                  :items="items"
                  :fields="fields"
                  :busy="isBusy"
                  show-empty
                  empty-text="No matching records found"
                >
                  <template v-slot:cell(createdTime)="data">
                    <span>{{
                      new Date(data.item.createdTime) | moment($formatDate)
                    }}</span>
                  </template>
                  <template v-slot:cell(receiptNo)="data">
                    <div v-if="data.item.receiptNo != ''">
                      {{ data.item.receiptNo }}
                    </div>
                    <div v-else>{{ data.item.quotationNo }}</div>
                  </template>
                  <template v-slot:cell(paymentChanel)="data">
                    <div>
                      <p class="m-0">{{ data.item.paymentChanel }}</p>
                      <p class="m-0" v-if="data.item.paymentRef != null">
                        {{ data.item.paymentRef }}
                      </p>
                    </div>
                  </template>
                  <template v-slot:cell(amount)="data">
                    <div>
                      <p class="m-0">
                        {{ data.item.amount | numeral("0,0.00") }}
                      </p>
                    </div>
                  </template>
                  <template v-slot:cell(id)="data">
                    <div class="d-flex justify-content-center">
                      <router-link :to="'/order/details/' + data.item.id">
                        <b-button
                          variant="link"
                          class="text-body text-underline"
                          >View</b-button
                        >
                      </router-link>
                    </div>
                  </template>
                  <template v-slot:table-busy>
                    <div class="text-center text-black my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong class="ml-2">Loading...</strong>
                    </div>
                  </template>
                </b-table>
              </div>
              <b-row>
                <b-col
                  class="form-inline justify-content-center justify-content-md-between"
                >
                  <b-pagination
                    v-model="filter.pageNo"
                    :total-rows="rows"
                    :per-page="filter.perPage"
                    class="m-md-0"
                    @change="pagination"
                  ></b-pagination>
                  <b-form-select
                    @change="hanndleChangePerpage"
                    v-model="filter.perPage"
                    :options="pageOptions"
                  ></b-form-select>
                </b-col>
              </b-row>
            </div>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button
                  v-if="id != 0"
                  class="btn btn-danger btn-details-set mr-md-2"
                  :disabled="isDisable"
                  @click="deleteData()"
                  >REMOVE</b-button
                >
                <b-button
                  href="/user"
                  class="btn-details-set"
                  :disabled="isDisable"
                  >CANCEL</b-button
                >
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="checkForm(0)"
                  :disabled="isDisable"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="checkForm(1)"
                  :disabled="isDisable"
                >
                  Save & Exit
                </button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </form>
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
        >
          ×
        </button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row v-if="addressDetail.id == 0">
            <b-col>
              <OptionsNameAddress
                :value="1"
                @handleOptionAddress="handleOptionAddress"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <InputText
                textFloat="Address Name"
                placeholder="Address Name"
                type="text"
                name="addressname"
                v-model="addressDetail.name"
                v-bind:isValidate="$v.addressDetail.name.$error"
                :v="$v.addressDetail.name"
                isRequired
              />
            </b-col>
          </b-row>

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
                v-bind:isValidate="$v.addressDetail.zipcodeId.$error"
                :v="$v.addressDetail.zipcodeId"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <InputText
                textFloat="Tax ID"
                placeholder="Tax ID"
                type="text"
                name="tax"
                v-model="addressDetail.taxNo"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <div class="panel d-flex align-items-md-center ml-1">
                <b-form-checkbox
                  size="lg"
                  id="shipping"
                  class="mb-3"
                  v-model="addressDetail.defaultShipping"
                  >Mark as default shipping address</b-form-checkbox
                >
              </div>
            </b-col>
            <b-col md="6">
              <div class="panel d-flex align-items-md-center mr-1 ml-1">
                <b-form-checkbox
                  size="lg"
                  id="receipt"
                  class="mb-3"
                  v-model="addressDetail.defaultBilling"
                  >Mark as default receipt address</b-form-checkbox
                >
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-3">
        <b-button class="btn btn-main" @click="saveAddress">Save</b-button>
      </div>
    </b-modal>
    <ModalAlert
      v-if="modalAlertShows"
      :msg="msgModals"
      :img="imgModals"
      :isOpen="modalAlertShows"
      @close="modalAlertShows = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
    />

    <ModalSuccess
      v-if="modalAlertShow"
      :msg="msgModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
    />
  </div>
</template>

<script>
import * as moment from "moment/moment";
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";
import InputSelect from "@/components/inputs/InputSelect";
import HeaderLine from "@/components/HeaderLine";
import {
  required,
  numeric,
  minValue,
  requiredIf,
  minLength,
  sameAs,
  maxValue,
} from "vuelidate/lib/validators";
import ModalSuccess from "@/components/ModalSuccess";
import ModalAlert from "@/components/ModalAlert";
import OptionsNameAddress from "./components/OptionsNameAddress";
import DatePickerDayMonthYear from "@/components/inputs/DatePickerDayMonthYear";

export default {
  name: "UserDetails",
  components: {
    InputText,
    HeaderLine,
    InputTextArea,
    InputSelect,
    ModalSuccess,
    ModalAlert,
    OptionsNameAddress,
    DatePickerDayMonthYear,
  },
  data() {
    return {
      id: this.$route.params.id,
      imageUrl: "../img/sample-product.png",
      isLoadingData: false,
      items: [],
      channels: [],
      existId: "",
      msgModal: null,
      msgModals: null,
      imgModals: null,
      modalAlertShow: false,
      modalAlertShows: false,
      isSuccess: false,
      isError: false,
      isReset: false,
      isEdit: false,
      rows: 0,
      flag: 0,
      verifiedColor: "",
      verifiedTxt: "",
      customer: {
        userProfile: {
          email: "",
          userGUID: "",
          genderId: 1,
          firstname: "",
          lastname: "",
          telephone: "",
          birthday: "",
          password: null,
          confirmPassword: null,
          memberTypeId: 1,
          isVerified: true,
          isSubscribe: true,
          createdTime: "",
          channelId: 0,
          otherDetail: "",
        },
        userAddressList: [],
      },
      addressDetail: {
        provinceId: 0,
        districtId: 0,
        subdistrictId: 0,
        zipcodeId: 0,
        id: 0,
        code: null,
        name: null,
        userGUID: null,
        defaultBilling: false,
        defaultShipping: false,
        firstname: null,
        lastname: null,
        address: null,
        taxNo: null,
      },
      list: {
        provinces: [],
        districts: [{ value: 0, text: "Please select District" }],
        subDistricts: [{ value: 0, text: "Please select Sub-District" }],
      },
      isDisable: false,
      isEdit: false,
      isBusy: false,
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" },
      ],
      fields: [
        {
          key: "createdTime",
          label: "Date",
          class: "w-100px",
        },
        {
          key: "receiptNo",
          label: "Order ID",
        },
        {
          key: "amount",
          label: "Amount",
        },
        {
          key: "paymentChanel",
          label: "Payment Channel",
          class: "w-100px",
        },
        {
          key: "status",
          label: "Status",
          class: "w-100px",
        },
        {
          key: "id",
          label: "",
        },
      ],
      filter: {
        perPage: 10,
        pageNo: 1,
      },
    };
  },
  validations: {
    addressDetail: {
      districtId: {
        required,
        numeric,
        minValue: minValue(1),
      },
      subdistrictId: {
        required,
        numeric,
        minValue: minValue(1),
      },
      provinceId: {
        required,
        numeric,
        minValue: minValue(1),
      },
      zipcodeId: {
        required,
        numeric,
        minValue: minValue(1),
      },
      address: { required },
      name: { required },
      firstname: { required },
      lastname: { required },
    },
    customer: {
      userProfile: {
        email: { required },
        password: {
          required: requiredIf(function () {
            return this.id == 0;
          }),
          minLength: minLength(6),
        },
        confirmPassword: {
          required: requiredIf(function () {
            return this.id == 0;
          }),
          minLength: minLength(6),
          sameAsPassword: sameAs("password"),
        },
        birthday: {
          required,
          maxValue: (value) => {
            let maxDate =
              moment(new Date()).subtract(1, "days").format("YYYY-MM-DD") +
              "T00:00:00.000Z";
            return value < maxDate;
          },
        },
      },
    },
  },
  mounted: async function () {
    await this.getData();
    await this.loadDataProvinces();
  },
  methods: {
    resetPass: async function () {
      this.isReset = true;
      this.modalAlertShow = false;

      let userid = {
        UserId: this.customer.userProfile.userGUID,
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/ForgotPassword`,
        null,
        this.$headers,
        userid
      );

      if (data.result == 1) {
        this.modalAlertShow = true;
        this.msgModal = "Success!";
      }

      this.isReset = false;
    },
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    editAddress: async function (id) {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/customer/UserAddress/${id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.addressDetail = data.detail;
      }

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

      this.$refs["changeAddressModal"].show();
    },
    loadDataProvinces: async function () {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/address/province`,
        null,
        this.$headers,
        null
      );
      let list = [{ value: 0, text: "Please select Province" }];
      let provinces = data.detail;
      provinces = provinces.map((obj) => {
        return {
          value: obj.id,
          text: obj.name,
        };
      });
      this.list.provinces = list.concat(provinces);
    },
    setZipCode: async function (subdistrictId = 0) {
      if (subdistrictId) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/zipcode/${subdistrictId}`,
          null,
          this.$headers,
          null
        );

        this.addressDetail.code = data.detail.name;
        this.addressDetail.zipcodeId = data.detail.id;
      } else {
        this.addressDetail.code = "";
        this.addressDetail.zipcodeId = 0;
      }
    },
    handleChangeSubDistrict: async function (value, zipCodeId = "") {
      this.addressDetail.subdistrictId = value;
      await this.setZipCode(this.addressDetail.subdistrictId);
    },
    handleChangeDistrict: async function (value, subdistrictId = 0) {
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
        subDistricts = subDistricts.map((obj) => {
          return {
            value: obj.id,
            text: obj.name,
          };
        });
      }
      this.list.subDistricts = await list.concat(subDistricts);
      this.addressDetail.subdistrictId = subdistrictId;
      await this.setZipCode(this.addressDetail.subdistrictId);
    },
    handleChangeProvince: async function (
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
        districts = districts.map((obj) => {
          return {
            value: obj.id,
            text: obj.name,
          };
        });
      }
      this.list.districts = await list.concat(districts);
      this.addressDetail.districtId = districtId;
      this.addressDetail.subdistrictId = subdistrictId;
      await this.setZipCode(this.addressDetail.subdistrictId);
    },
    handleChangeChannel: async function (value) {
      this.customer.userProfile.channelId = value;
    },
    getData: async function () {
      this.isBusy = true;

      let channel = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/customer/channel`,
        null,
        this.$headers,
        null
      );

      if (channel.result == 1) {
        this.channels = channel.detail;

        let list = [{ id: 0, name: "Please select channel" }];

        let lists = channel.detail;
        lists = lists.map((obj) => {
          return {
            id: obj.id,
            name: obj.name,
          };
        });

        this.channels = list.concat(lists);
      }

      if (this.id != 0) {
        this.isLoadingData = true;

        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/customer/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          this.isBusy = false;
          this.customer = data.detail;
          this.isLoadingData = false;
          this.$v.customer.$reset();

          if (this.customer.userProfile.userGUID != 0) this.isEdit = true;

          if (this.customer.userProfile.isVerified == true) {
            this.verifiedColor = "text-success";
            this.verifiedTxt = "Verified";
          } else {
            this.verifiedColor = "text-danger";
            this.verifiedTxt = "Not Verified";
          }
        }

        let trans = await this.$callApi(
          "post",
          `${this.$baseUrl}/api/customer/UserTransactionList/${this.id}`,
          null,
          this.$headers,
          this.filter
        );

        this.isBusy = false;

        if (trans.result == 1) {
          this.items = trans.detail.transactionList;
          this.rows = trans.detail.count;
        }
      }
    },
    checkForm: async function (flag) {
      this.$v.customer.userProfile.$touch();

      if (this.$v.customer.userProfile.$error) {
        return;
      }

      this.modalAlertShows = false;
      this.flag = flag;

      this.submit();
    },
    submit: async function () {
      this.isDisable = true;

      let userData = {
        email: this.customer.userProfile.email,
        userGUID: this.customer.userProfile.userGUID,
        genderId: this.customer.userProfile.genderId,
        firstname: this.customer.userProfile.firstname,
        lastname: this.customer.userProfile.lastname,
        telephone: this.customer.userProfile.telephone,
        birthday: this.customer.userProfile.birthday,
        password: this.customer.userProfile.password,
        confirmPassword: this.customer.userProfile.confirmPassword,
        memberTypeId: 1,
        isVerified: this.customer.userProfile.isVerified,
        isSubscribe: this.customer.userProfile.isSubscribe,
        channelId: this.customer.userProfile.channelId,
        otherDetail: this.customer.userProfile.otherDetail,
      };

      if (this.id == 0) {
        this.customer.userProfile.userGUID == null;
        let data = await this.$callApi(
          "post",
          `${this.$baseUrl}/api/customer/Create`,
          null,
          this.$headers,
          userData
        );

        this.modalAlertShows = true;
        if (data.result == 1) {
          this.imgModals = "/img/icon-check-green.png";
          this.msgModals = data.message;
          this.isSuccess = true;
          this.existId = data.detail.id;
        } else {
          this.imgModals = "/img/icon-unsuccess.png";
          this.msgModals = data.detail[0];
          this.isSuccess = false;
        }
      } else {
        let data = await this.$callApi(
          "post",
          `${this.$baseUrl}/api/customer/save`,
          null,
          this.$headers,
          userData
        );

        this.modalAlertShows = true;
        if (data.result == 1) {
          this.imgModals = "/img/icon-check-green.png";
          this.msgModals = data.message;
          this.isSuccess = true;
        } else {
          this.imgModals = "/img/icon-unsuccess.png";
          this.msgModals = data.message;
          this.isSuccess = false;
        }
      }

      this.isDisable = false;
    },
    handleCloseModal: function () {
      if (this.flag == 1) {
        window.location.href = "/user";
      } else {
        if (this.id != 0) {
          this.getData();
          this.loadDataProvinces();
        } else {
          this.customer.userProfile.userGUID = this.existId;
          this.id = this.existId;
          this.isEdit = true;
          this.$router.push({ path: `/user/details/${this.existId}` });
          this.getData();
          this.loadDataProvinces();
        }
      }
    },
    pagination(Page) {
      this.filter.pageNo = Page;
      this.getData();
    },
    hanndleChangePerpage(value) {
      this.filter.pageNo = 1;
      this.filter.perPage = value;
      this.getData();
    },
    saveAddress: async function () {
      this.$v.addressDetail.$touch();
      if (this.$v.addressDetail.$error) {
        return;
      }

      this.$v.addressDetail.$reset();

      if (this.addressDetail.userGUID == null) {
        this.addressDetail.userGUID = this.customer.userProfile.userGUID;
      }

      let addressData = {
        id: this.addressDetail.id,
        name: this.addressDetail.name,
        userGUID: this.addressDetail.userGUID,
        defaultBilling: this.addressDetail.defaultShipping,
        defaultShipping: this.addressDetail.defaultBilling,
        firstname: this.addressDetail.firstname,
        lastname: this.addressDetail.lastname,
        address: this.addressDetail.address,
        zipcodeId: this.addressDetail.zipcodeId,
        taxNo: this.addressDetail.taxNo,
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/customer/SaveUserAddress`,
        null,
        this.$headers,
        addressData
      );

      if (data.result == 1) {
        this.$refs["changeAddressModal"].hide();
        this.modalAlertShow = true;
        this.msgModal = "Success!";
        this.getData();
      }
    },
    deleteAddress: async function (id) {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/customer/${id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          this.modalAlertShow = true;
          this.msgModal = "Success!";
          this.getData();
        }
      }
    },
    handleOptionAddress(val) {
      this.addressDetail.name = "";
      if (val == 1) {
        this.addressDetail.name = "Home";
      } else if (val == 2) {
        this.addressDetail.name = "Office";
      } else {
        this.addressDetail.name = "";
      }
    },
    deleteData: async function () {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/customer/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/user";
        }
      }
    },
  },
};
</script>

<style scoped>
.verified-txt {
  position: absolute;
  right: 15px;
  top: 3px;
}

.reset-pass {
  position: absolute;
  bottom: -5px;
  right: 15px;
  font-size: 12px;
  text-decoration: underline;
  background: none;
  border: none;
  padding: 0;
}

.wrap-normal {
  white-space: normal;
}
</style>