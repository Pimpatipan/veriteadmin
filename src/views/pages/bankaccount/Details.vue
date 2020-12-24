<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Bank Account Details</h1>
          </b-col>
        </b-row>

        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4 vh-100" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>
          <b-col class="px-4 px-sm-5 py-4" v-else>
            <b-row class="pl-1 my-3">
              <b-col cols="6">
                <div class="panel d-flex align-items-md-center">
                  <b-form-checkbox
                    size="lg"
                    id="sameLang"
                    class="mt-0 mt-sm-3"
                    @change="useSameLanguage"
                    v-model="form.isSameLanguage"
                  >ใช้เหมือนกันทุกภาษา</b-form-checkbox>
                </div>
              </b-col>
              <b-col cols="6" class="text-right">
                <b-button
                  type="button"
                  class="btn btn-language"
                  v-for="(language, index) in languageList"
                  v-bind:key="index"
                  v-bind:class="[ languageActive == language.id ? 'active' : '' ]"
                  @click="changeLanguage(language.id,index)"
                  :disabled="form.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <InputSelect
              title="Bank Name"
              name="transferFromBank"
              v-model="form.bankAccount.bankId"
              isRequired
              v-bind:options="bank"
              valueField="id"
              textField="name"
              @onDataChange="handleChangeSourceBank"
            />

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Account No."
                  placeholder="Account No."
                  type="text"
                  name="accountno"
                  isRequired
                  v-model="form.bankAccount.accountNo"
                  :isValidate="$v.form.bankAccount.accountNo.$error"
                  :v="$v.form.bankAccount.accountNo"
                />
              </b-col>
              <b-col md="6">
                <div v-for="(item, index) in form.bankAccountTranslationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <InputText
                      textFloat="Account Name"
                      placeholder="Account Name"
                      type="text"
                      name="accountname"
                      isRequired
                      v-model="item.name"
                      :img="imageLogoLang"
                      :isValidate="$v.form.bankAccountTranslationList.$each.$iter[index].name.$error"
                      :v="$v.form.bankAccountTranslationList.$each.$iter[index].name"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Sort Order"
                  placeholder="Sort Order"
                  type="text"
                  name="sortorder"
                  v-model="form.bankAccount.sortOrder"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
              <b-col md="6">
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="form.bankAccount.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span
                      class="ml-2 main-label"
                    >{{form.bankAccount.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button
                  class="btn btn-danger btn-details-set mr-md-2"
                  :disabled="isDisable"
                  @click="deleteData()"
                  v-if="isEdit"
                >REMOVE</b-button>
                <b-button href="/bankaccount" :disabled="isDisable" class="btn-details-set">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  @click="checkForm(0)"
                  :disabled="isDisable"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                >Save</button>
                <button
                  type="button"
                  @click="checkForm(1)"
                  :disabled="isDisable"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                >Save & Exit</button>
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
import InputSelect from "@/components/inputs/InputSelect";
import { required } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";

export default {
  name: "BankAccountDetails",
  components: {
    InputText,
    InputSelect,
    ModalAlert
  },
  data() {
    return {
      languageList: [],
      bank: [],
      imageLogoLang: "",
      languageActive: 1,
      isEdit: false,
      isLoadingData: false,
      isDisable: false,
      imgModal: null,
      msgModal: null,
      id: this.$route.params.id,
      existId: "",
      modalAlertShow: false,
      form: {
        bankAccount: {
          id: 0,
          deleted: false,
          enabled: false,
          bankId: 0,
          accountNo: null,
          sortOrder: 0,
          mainLanguageId: 0
        },
        bankAccountTranslationList: [
          {
            bankAccountId: 0,
            languageId: 1,
            name: null
          },
          {
            bankAccountId: 0,
            languageId: 2,
            name: null
          }
        ],
        isSameLanguage: false
      }
    };
  },
  validations: {
    form: {
      bankAccount: {
        accountNo: { required }
      },
      bankAccountTranslationList: {
        $each: {
          name: { required }
        }
      }
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
    handleChangeSourceBank: async function(value) {
      this.form.bankAccount.bankId = value;
    },
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/bankaccount";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          this.id = this.existId;
          this.form.bankAccount.id = this.existId;
          this.isEdit = true;
          this.$router.push({ path: `/bankaccount/details/${this.existId}` });
        }
      }
    },
    getDatas: async function() {
      this.isLoadingData = true;

      let languages = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/language`,
        null,
        this.$headers,
        null
      );

      if (languages.result == 1) {
        this.languageList = languages.detail;
        this.changeLanguage(1, 0);
      }

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/BankAccount/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.form.bankAccount.id > 0) {
          this.isEdit = true;
        }

        if (this.form.isSameLanguage) {
          this.imageLogoLang = "";
        } else {
          var index = this.languageList
            .map(function(x) {
              return x.id;
            })
            .indexOf(this.languageActive);
          this.imageLogoLang = this.languageList[index].imageUrl;
        }
      }

      let uploads = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/bank/list`,
        null,
        this.$headers,
        null
      );

      if (uploads.result == 1) {
        this.bank = uploads.detail.dataList;

        if (this.id > 0) {
          this.form.bankAccount.bankId = this.form.bankAccount.bankId;
        } else {
          this.form.bankAccount.bankId = this.bank[0].id;
        }
      }
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.bankAccount.mainLanguageId = this.languageActive;
          let data = this.form.bankAccountTranslationList.filter(
            val => val.languageId == this.form.bankAccount.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.bankAccountTranslationList.length;
                index++
              ) {
                this.form.bankAccountTranslationList[index].name = data.name;
              }
            }
          }
        } else {
          var index = this.languageList
            .map(function(x) {
              return x.id;
            })
            .indexOf(this.languageActive);
          this.imageLogoLang = this.languageList[index].imageUrl;
          let data = this.form.bankAccountTranslationList.filter(
            val => val.languageId != this.form.bankAccount.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.name = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList: async function() {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (
            this.$v.form.bankAccountTranslationList.$each.$iter[index].$error
          ) {
            this.languageActive = this.$v.form.bankAccountTranslationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    checkForm: async function(flag) {
      if (this.form.isSameLanguage) {
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
        `${this.$baseUrl}/api/BankAccount/save`,
        null,
        this.$headers,
        this.form
      );

      this.modalAlertShow = true;
      if (data.result == 1) {
        this.imgModal = "/img/icon-check-green.png";
        this.msgModal = data.message;
        this.isSuccess = true;
        this.existId = data.detail.id;
      } else {
        this.imgModal = "/img/icon-unsuccess.png";
        this.msgModal = data.detail[0];
        this.isSuccess = false;
      }

      this.isDisable = false;
    },
    deleteData: async function() {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/BankAccount/remove/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/bankaccount";
        }
      }
    }
  }
};
</script>