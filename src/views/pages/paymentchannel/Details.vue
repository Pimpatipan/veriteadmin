<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Payment Channel Details</h1>
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
                    v-model="form.paymentType.isSameLanguage"
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
                  :disabled="form.paymentType.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <div v-for="(item, index) in form.paymentType.translationList" v-bind:key="index">
              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <InputText
                  class="my-4"
                  textFloat="Name"
                  placeholder="Name"
                  type="text"
                  name="name"
                  isRequired
                  v-model="item.name"
                  :img="imageLogoLang"
                  :isValidate="$v.form.paymentType.translationList.$each.$iter[index].name.$error"
                  :v="$v.form.paymentType.translationList.$each.$iter[index].name"
                />
              </div>
            </div>

            <b-row>
              <b-col md="6">
                <UploadFile
                  textFloat="Thumbnail"
                  placeholder="Please choose file"
                  format="image"
                  name="thumbnail"
                  text="*Please upload only file .png, .jpg size 100 x 100 px and less than 10 MB"
                  isRequired
                  :fileName="form.paymentType.imageUrl"
                  v-model="form.paymentType.imageUrl"
                  v-on:onFileChange="onImageChange"
                  v-on:delete="deleteImage"
                  :v="$v.form.paymentType.imageUrl"
                />

                <div
                  class="preview-box shipping-img"
                  v-bind:style="{ 'background-image': 'url('+showPreview+')' }"
                >
                  <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoading" />
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  class="my-4"
                  textFloat="Sort Order"
                  placeholder="Sort Order"
                  type="text"
                  name="sortorder"
                  v-model="form.paymentType.sortOrder"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <label class="font-weight-bold main-label">Display Status</label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="form.paymentType.display"
                    class="radio-active"
                    size="lg"
                  >
                    <span
                      class="ml-2 main-label"
                    >{{form.paymentType.display ? 'Active' : 'Inactive' }}</span>
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
                <b-button
                  href="/paymentchannel"
                  :disabled="isDisable"
                  class="btn-details-set"
                >CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  v-if="isEdit"
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
import UploadFile from "@/components/inputs/UploadFile";
import { required } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";

export default {
  name: "StoreTypeDetails",
  components: {
    InputText,
    UploadFile,
    ModalAlert
  },
  data() {
    return {
      id: this.$route.params.id,
      languageList: [],
      imageLogoLang: "",
      languageActive: 1,
      showPreview: "",
      isLoading: false,
      isLoadingData: false,
      isDisable: false,
      imgModal: null,
      msgModal: null,
      isEdit: false,
      modalAlertShow: false,
      form: {
        paymentType: {
          id: 0,
          sortOrder: 0,
          imageUrl: "",
          display: false,
          mainLanguageId: 1,
          isSameLanguage: true,
          translationList: [
            {
              languageId: 1,
              name: null
            },
            {
              languageId: 2,
              name: null
            }
          ]
        }
      }
    };
  },
  validations: {
    form: {
      paymentType: {
        imageUrl: { required },
        translationList: {
          $each: {
            name: { required }
          }
        }
      }
    }
  },
  created: async function() {
    await this.getDatas();
  },
  methods: {
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/paymentchannel";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          window.location.href = "/paymentchannel";
        }
      }
    },
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
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
        `${this.$baseUrl}/api/paymentChannel/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.form.paymentType.id > 0) {
          this.isEdit = true;
          this.showPreview = this.form.paymentType.imageUrl;
        }

        if (this.form.paymentType.isSameLanguage) {
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
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    onImageChange(img) {
      this.isLoading = true;
      this.isDisable = true;
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = async () => {
        this.images = await this.saveImagetoDb(reader.result);
        this.isLoading = false;
        this.isDisable = false;
        this.showPreview = this.images;
        this.form.paymentType.imageUrl = this.images;
      };
    },
    deleteImage(value) {
      this.form.paymentType.imageUrl = null;
      this.showPreview = null;
    },
    saveImagetoDb: async function(img) {
      var imgData = {
        base64: img
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/image/save`,
        null,
        this.$headers,
        imgData
      );

      if (data.result == 1) {
        return data.detail.url;
      }
    },
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.paymentType.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.paymentType.mainLanguageId = this.languageActive;
          let data = this.form.paymentType.translationList.filter(
            val => val.languageId == this.form.paymentType.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.paymentType.translationList.length;
                index++
              ) {
                this.form.paymentType.translationList[index].name = data.name;
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

          let data = this.form.paymentType.translationList.filter(
            val => val.languageId != this.form.paymentType.mainLanguageId
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
            this.$v.form.paymentType.translationList.$each.$iter[index].$error
          ) {
            this.languageActive = this.$v.form.paymentType.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    checkForm: async function(flag) {
      if (this.form.paymentType.isSameLanguage) {
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
        `${this.$baseUrl}/api/paymentChannel/savePaymentChannel`,
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
    },
    deleteData: async function() {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/paymentChannel/removePaymentChannel/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/paymentchannel";
        }
      }
    }
  }
};
</script>

<style scoped>
.shipping-img {
  width: 25%;
  padding-bottom: 25%;
  margin: auto;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>