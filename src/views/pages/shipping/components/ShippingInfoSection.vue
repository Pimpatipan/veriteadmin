<template>
  <div>
    <div v-if="isLoadingData" class="vh-100">
      <img src="/img/loading.svg" class="loading" alt="loading" />
    </div>

    <form class="form-box" v-else>
      <b-row class="pl-1 my-3">
        <b-col cols="6">
          <div class="panel d-flex align-items-md-center">
            <b-form-checkbox
              size="lg"
              id="sameLang"
              class="mt-0 mt-sm-3"
              @change="useSameLanguage"
              v-model="form.shipping.isSameLanguage"
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
            :disabled="form.shipping.isSameLanguage ? true : false "
          >
            <span class="text-uppercase">{{language.nation}}</span>
          </b-button>
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <div v-for="(item, index) in form.shipping.translationList" v-bind:key="index">
            <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
              <InputText
                textFloat="Shipping Name"
                placeholder="Shipping Name"
                type="text"
                name="shippingname"
                isRequired
                v-model="item.name"
                :img="imageLogoLang"
                :isValidate="$v.form.shipping.translationList.$each.$iter[index].name.$error"
                :v="$v.form.shipping.translationList.$each.$iter[index].name"
                @onKeyup="setAlttag(item.name)"
              />
            </div>
          </div>
        </b-col>
        <b-col md="6">
          <InputText
            textFloat="Estimate Shipping Day"
            placeholder="Estimate Shipping Day"
            type="text"
            name="estimateshoppingday"
            isRequired
            :isValidate="$v.form.shipping.deliveryTime.$error"
            :v="$v.form.shipping.deliveryTime"
            v-model="form.shipping.deliveryTime"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col md="6">
          <UploadFile
            textFloat="Icon"
            placeholder="Please choose file"
            format="image"
            name="thumbnail"
            text="*Please upload only file .png, .jpg size 100 x 100 px and less than 10 MB"
            isRequired
            :fileName="form.shipping.imageUrl"
            v-model="form.shipping.imageUrl"
            v-on:onFileChange="onImageChange"
            v-on:delete="deleteImage"
            :v="$v.form.shipping.imageUrl"
          />

          <div
            class="preview-box shipping-img"
            v-bind:style="{ 'background-image': 'url('+showPreview+')' }"
          >
            <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoading" />
          </div>
        </b-col>
        <b-col md="6">
          <InputText
            textFloat="Alt Tag"
            placeholder="Alt Tag"
            type="text"
            name="alttag"
            isRequired
            v-model="form.shipping.altTag"
            @onKeypress="isNumber($event)"
          />
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col md="6">
          <label class="main-label mb-2">
            Shipping Rate By
            <span class="text-danger">*</span>
          </label>
          <b-row class="mb-3 mb-sm-0">
            <b-col
              md="6"
              class="mb-1 mb-sm-0"
              v-for="(item,index) in form.shippingConditionList"
              v-bind:key="index"
            >
              <b-form-radio
                name="some-radios"
                v-model="form.shipping.shippingConditionId"
                :value="item.id"
              >{{item.name}}</b-form-radio>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-row class="mt-2 mt-sm-4">
        <b-col md="6">
          <InputText
            textFloat="Sort Order"
            placeholder="Sort Order"
            type="text"
            name="sortorder"
            v-model="form.shipping.sortOrder"
            @onKeypress="isNumber($event)"
          />
        </b-col>
        <b-col md="6">
          <label class="font-weight-bold main-label">
            Display Status
            <span class="text-danger">*</span>
          </label>
          <div>
            <b-form-checkbox switch v-model="form.shipping.enabled" class="radio-active" size="lg">
              <span class="ml-2 main-label">{{form.shipping.enabled ? 'Active' : 'Inactive' }}</span>
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
          <b-button href="/shipping" :disabled="isDisable" class="btn-details-set">CANCEL</b-button>
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
  name: "ShippingInfoDetails",
  components: {
    InputText,
    UploadFile,
    ModalAlert
  },
  data() {
    return {
      id: this.$route.params.id,
      languageList: [],
      items: [],
      imageLogoLang: "",
       existId: "",
      showPreview: "",
      languageActive: 1,
      isDisable: false,
      isLoadingData: false,
      isEdit: false,
      isLoading: false,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      form: {
        shipping: {
          id: 0,
          imageUrl: "",
          altTag: null,
          sortOrder: 0,
          enabled: false,
          mainLanguageId: 0,
          deliveryTime: null,
          shippingConditionId: 0,
          isSameLanguage: false,
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
        },
        shippingConditionList: []
      }
    };
  },
  validations: {
    form: {
      shipping: {
        imageUrl: { required },
        altTag: { required },
        deliveryTime: { required },
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
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    setAlttag: function(name) {
      this.form.shipping.altTag = name;
    },
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/shipping";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          this.form.shipping.id = this.existId;
          this.id = this.existId;
          this.isEdit = true;
          this.$router.push({ path: `/shipping/details/${this.existId}` });
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
        `${this.$baseUrl}/api/shipping/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.form.shipping.id > 0) {
          this.isEdit = true;
          this.showPreview = this.form.shipping.imageUrl;
        } else {
          this.form.shipping.shippingConditionId = 1;
        }

        if (this.form.shipping.isSameLanguage) {
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
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.shipping.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.shipping.mainLanguageId = this.languageActive;
          let data = this.form.shipping.translationList.filter(
            val => val.languageId == this.form.shipping.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.shipping.translationList.length;
                index++
              ) {
                this.form.shipping.translationList[index].name = data.name;
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

          let data = this.form.shipping.translationList.filter(
            val => val.languageId != this.form.shipping.mainLanguageId
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
          if (this.$v.form.shipping.translationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.shipping.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    checkForm: async function(flag) {
      if (this.form.shipping.isSameLanguage) {
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
        `${this.$baseUrl}/api/shipping/save`,
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
          `${this.$baseUrl}/api/shipping/removeShippingType/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/shipping";
        }
      }
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
        this.form.shipping.imageUrl = this.images;
      };
    },
    deleteImage(value) {
      this.form.shipping.imageUrl = null;
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
