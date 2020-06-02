<template>
  <div>
    <form class="form-box">
      <b-row class="no-gutters bg-white-border">
        <b-col class="px-4 px-sm-5 py-4" v-if="isLoadingData">
          <img src="/img/loading.svg" class="loading" alt="loading" />
        </b-col>
        <b-col class="px-4 px-sm-5 py-4" v-else>
          <b-row>
            <b-col md="6">
              <label class="label-text my-4">
                Price:
                <span class="text-body pl-3">{{adprices.price | numeral('0,0.00') }}</span>
              </label>

              <InputText
                textFloat="Advance Price"
                placeholder="Advance Price"
                type="text"
                name="secialprice"
                isRequired
                v-model="adprices.priceAfterDiscount"
                :isValidate="$v.adprices.priceAfterDiscount.$error"
                :v="$v.adprices.priceAfterDiscount"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <label class="label-text">
                Valid from
                <span class="text-danger">*</span>
              </label>
              <datetime
                placeholder="Please select date"
                class="date-picker"
                format="dd/MM/yyyy HH:mm"
                v-model="adprices.startDate"
                type="datetime"
              ></datetime>
              <p class="text-danger" v-if="error">The Valid from date must be earlier than end date</p>
            </b-col>
            <b-col md="6">
              <label class="label-text">
                Valid to
                <span class="text-danger">*</span>
              </label>
              <datetime
                placeholder="Please select date"
                class="date-picker"
                format="dd/MM/yyyy HH:mm"
                v-model="adprices.endDate"
                type="datetime"
              ></datetime>
            </b-col>
          </b-row>
          <b-row class="mt-5">
            <b-col md="6">
              <b-button
                class="btn btn-danger btn-details-set mr-md-2"
                @click="deleteAdvancePricing"
                :disabled="isDisable"
                v-if="isEdit"
              >REMOVE</b-button>
              <b-button href="/product" class="btn-details-set" :disabled="isDisable">CANCEL</b-button>
            </b-col>
            <b-col md="6" class="text-sm-right">
              <button
                type="button"
                class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                @click="checkAdvancePricing(0)"
                :disabled="isDisable"
                v-if="isEdit"
              >Save</button>
              <button
                type="button"
                class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                @click="checkAdvancePricing(1)"
                :disabled="isDisable"
              >Save & Exit</button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
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

    <b-modal
      id="modalFail"
      ref="modalFail"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <button type="button" aria-label="Close" class="close" @click="$bvModal.hide('modalFail')">×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <div class="text-center">
                <img src="/img/icon-unsuccess.png" alt="fail" class="mb-3" />
                <h1 class="text-msg mt-3 font-weight-bold">Please create product before proceeding</h1>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import { required } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";
import * as moment from "moment/moment";

export default {
  name: "ProductAdvancePricing",
  components: {
    InputText,
    ModalAlert
  },
  data() {
    return {
      id: this.$route.params.id,
      isDisable: false,
      isEdit: false,
      isLoadingData: false,
      error: false,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      adprices: {
        price: 0.0,
        productId: 0,
        priceAfterDiscount: 0,
        startDate: "",
        endDate: ""
      }
    };
  },
  validations: {
    adprices: {
      priceAfterDiscount: { required }
    }
  },
  created: async function() {
    if (this.id != 0) {
      await this.getAdvancePricing();
    }
  },
  methods: {
    moment: function() {
      return moment();
    },
    handleCloseModal: async function() {
      if (this.flag == 1) {
        window.location.href = "/product";
      } else {
        if (this.id > 0) {
          this.getAdvancePricing();
        } else {
          window.location.href = "/product";
        }
      }
    },
    getAdvancePricing: async function() {
       this.isLoadingData = true;

      let adprice = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/advancePrice/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (adprice.result == 1) {
        this.adprices = adprice.detail;
        this.isLoadingData = false;
        this.$v.adprices.$reset();

        if (this.adprices.id == 0) {
          this.adprices.startDate = moment().format();
          this.adprices.endDate = moment().format();
        } else {
          this.isEdit = true;
        }
      }
    },
    checkAdvancePricing: async function(flag) {
      this.modalAlertShow = false;
      this.flag = flag;

      if (this.id == 0) {
        this.$refs["modalFail"].show();
        return;
      }

      this.$v.adprices.$touch();
      if (this.$v.adprices.$error) {
        return;
      }

      if (new Date(this.adprices.endDate) < new Date(this.adprices.startDate)) {
        this.error = true;
        return;
      }

      this.saveAdvancePricing();
    },
    saveAdvancePricing: async function() {
      this.isDisable = true;
      this.adprices.productId = this.id;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveAdvancePrice`,
        null,
        this.$headers,
        this.adprices
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
    },
    deleteAdvancePricing: async function() {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/product/removeAdvancePrice/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          this.getAdvancePricing();
        }
      }
    }
  }
};
</script>