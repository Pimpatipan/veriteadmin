<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Configuration</h1>
          </b-col>
        </b-row>

        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4 vh-100" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>

          <b-col class="px-4 px-sm-5 py-4" v-else>
            <HeaderLine text="Infomation" class="mb-4" />

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Telephone"
                  placeholder="Telephone"
                  type="text"
                  name="tel"
                  isRequired
                  @onKeypress="isNumber($event)"
                  v-model="form.telephone"
                  :isValidate="$v.form.telephone.$error"
                  :v="$v.form.telephone"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Customer Service"
                  placeholder="Customer Service"
                  type="text"
                  name="customerservice"
                  isRequired
                  v-model="form.customerServiceEmail"
                  :isValidate="$v.form.customerServiceEmail.$error"
                  :v="$v.form.customerServiceEmail"
                />
              </b-col>
            </b-row>

            <HeaderLine text="Order" class="mb-4" />

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Order Expire Day"
                  placeholder="Order Expire Day"
                  type="text"
                  name="expireday"
                  isRequired
                  @onKeypress="isNumber($event)"
                  v-model="form.configDay.orderExpireDay"
                  :isValidate="$v.form.configDay.orderExpireDay.$error"
                  :v="$v.form.configDay.orderExpireDay"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Review Email Day"
                  placeholder="Review Email Day"
                  type="text"
                  name="reviewday"
                  isRequired
                  @onKeypress="isNumber($event)"
                  v-model="form.configDay.orderReviewDay"
                  :isValidate="$v.form.configDay.orderReviewDay.$error"
                  :v="$v.form.configDay.orderReviewDay"
                />
              </b-col>
            </b-row>

            <!-- <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Pending Payment Day"
                  placeholder="Pending Payment Day"
                  type="text"
                  name="paymentday"
                  isRequired
                  @onKeypress="isNumber($event)"
                  v-model="form.configDay.pendingPaymentDay"
                  :isValidate="$v.form.configDay.pendingPaymentDay.$error"
                  :v="$v.form.configDay.pendingPaymentDay"
                />
              </b-col>
            </b-row> -->

            <HeaderLine text="Email Notification" class="my-4" />

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Sender Email"
                  placeholder="Sender Email"
                  type="text"
                  name="email"
                  isRequired
                  v-model="form.senderEmail.email"
                  :isValidate="$v.form.senderEmail.email.$error"
                  :v="$v.form.senderEmail.email"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Sender Email Password"
                  placeholder="Sender Email Password"
                  type="password"
                  name="password"
                  v-model="form.senderEmail.password"
                  :isValidate="$v.form.senderEmail.password.$error"
                  :v="$v.form.senderEmail.password"
                />
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <!-- <b-button href="/storetype" class="btn-details-set">CANCEL</b-button> -->
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set text-uppercase"
                  @click="checkForm(0)"
                >Save</button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </form>
    <ModalAlert
      v-if="modalAlertShow"
      :msg="msgModal"
      :img="imgModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
    />
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import ModalAlert from "@/components/ModalAlert";
import HeaderLine from "@/components/HeaderLine";
import { required,minLength } from "vuelidate/lib/validators";

export default {
  name: "Configuration",
  components: {
    InputText,
    HeaderLine,
    ModalAlert
  },
  data() {
    return {
      isDisable: false,
      isLoadingData: false,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      form: {
        configDay: {
          id: 0,
          orderExpireDay: 0,
          orderReviewDay: 0,
          pendingPaymentDay: 0
        },
        senderEmail: {
          id: 0,
          email: "",
          password: null
        },
        telephone: "",
        customerServiceEmail: ""
      }
    };
  },
  validations: {
    form: {
      configDay: {
        orderExpireDay: { required },
        orderReviewDay: { required },
        pendingPaymentDay: { required }
      },
      senderEmail: {
        email: { required },
        password: { minLength: minLength(6) }
      },
      telephone: { required },
      customerServiceEmail: { required }
    }
  },
  created: async function() {
    await this.getDatas();
  },
  methods: {
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    handleCloseModal: function() {
      this.getDatas();
    },
    getDatas: async function() {
      this.isLoadingData = true;

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/Configuration`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();
      }
    },
    checkForm: async function(flag) {
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        return;
      }
      this.modalAlertShow = false;
      this.flag = flag;
      this.submit();
    },
    submit: async function() {
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/Configuration/saveConfiguration`,
        null,
        this.$headers,
        this.form
      );

      this.modalAlertShow = true;
      if (data.result == 1) {
        this.imgModal = "/img/icon-check-green.png";
        this.msgModal = data.message;
        this.isSuccess = true;
      } else {
        this.imgModal = "/img/icon-unsuccess.png";
        this.msgModal = data.detail[0];
        this.isSuccess = false;
      }

      this.isDisable = false;
    }
  }
};
</script>