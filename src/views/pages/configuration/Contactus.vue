<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Contact Us</h1>
          </b-col>
        </b-row>

        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4 vh-100" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>

          <b-col class="px-4 px-sm-5 py-4" v-else>
            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Telephone"
                  placeholder="Telephone"
                  type="text"
                  name="tel"
                  isRequired
                  @onKeypress="isNumber($event)"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Customer Service"
                  placeholder="Customer Service"
                  type="text"
                  name="customerservice"
                />
              </b-col>
            </b-row>

            <b-row class="mt-3">
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
      modalAlertShow: false
    };
  },
  created: async function() {
    //await this.getDatas();
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
        `${this.$baseUrl}/api/skinConsultWeb`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        this.showPreview = this.form.skinConsultWeb.imageUrl;
      }
    },
    checkForm: async function(flag) {
      if (this.form.skinConsultWeb.isSameLanguage) {
        await this.useSameLanguage();
      }
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        await this.checkValidateTranslationList();
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
        `${this.$baseUrl}/api/skinConsultWeb/save`,
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