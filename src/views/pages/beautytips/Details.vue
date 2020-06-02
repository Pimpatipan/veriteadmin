<template>
  <div>
    <form class="form-box" @submit.prevent="checkForm($event)">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Beauty Tips Details</h1>
          </b-col>
        </b-row>

        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>
          <b-col class="px-4 px-sm-5 py-4" v-else>
            <b-row class="pl-1 my-3">
              <b-col cols="6">
                <div class="panel d-flex align-items-md-center">
                  <b-form-checkbox
                    size="lg"
                    id="highlight"
                    v-model="form.blogHighlight"
                    class="mt-0 mt-sm-3"
                  >Mark as Highlight</b-form-checkbox>
                </div>
                <div class="panel d-flex align-items-md-center">
                  <b-form-checkbox
                    size="lg"
                    id="sameLang"
                    v-model="form.isSameLanguage"
                    class="mt-3"
                    @change="useSameLanguage"
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

            <div v-for="(item, index) in form.blogTranslationList" v-bind:key="index">
              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <b-row>
                  <b-col>
                    <InputText
                      class="mb-4"
                      textFloat="Article Name"
                      placeholder="Article Name"
                      type="text"
                      name="name"
                      isRequired
                      v-model="item.name"
                      :img="imageLogoLang"
                      @onKeyup="setMetaTitleandKeyword(item.name,index)"
                      :isValidate="$v.form.blogTranslationList.$each.$iter[index].name.$error"
                      :v="$v.form.blogTranslationList.$each.$iter[index].name"
                    />
                    <!-- :keyup="setMetaTitleandKeyword(item.name,index)" -->
                  </b-col>
                </b-row>
              </div>

              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <b-row>
                  <b-col>
                    <InputTextArea
                      class="mb-4"
                      textFloat="Short Description"
                      placeholder="Short Description"
                      type="text"
                      name="name"
                      isRequired
                      :img="imageLogoLang"
                      @onKeyup="setMetaDescription(item.shortDescription,index)"
                      v-model="item.shortDescription"
                      :isValidate="$v.form.blogTranslationList.$each.$iter[index].shortDescription.$error"
                      :v="$v.form.blogTranslationList.$each.$iter[index].shortDescription"
                    />
                    <!-- :keyup="setMetaDescription(item.shortDescription,index)" -->
                  </b-col>
                </b-row>
              </div>

              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <b-row>
                  <b-col>
                    <TextEditor
                      textFloat="Article Details"
                      :rows="8"
                      :value="item.description"
                      :name="'description_'+item.languageId"
                      :img="imageLogoLang"
                      placeholder="Type something..."
                      isRequired
                      :v="$v.form.blogTranslationList.$each.$iter[index].description"
                      @onDataChange="(val) => item.description = val"
                    />
                  </b-col>
                </b-row>
              </div>
            </div>

            <b-row>
              <b-col md="6">
                <div
                  class="preview-box"
                  v-bind:style="{ 'background-image': 'url(' + showPreview + ')' }"
                ></div>
              </b-col>
              <b-col md="6">
                <UploadFile
                  textFloat="Cover Image"
                  placeholder="Please choose file"
                  format="image"
                  :fileName="form.blog.imageUrl"
                  v-model="form.blog.imageUrl"
                  name="thumbnail"
                  text="*Please upload only file .png, .jpg size 1078 x 1079 px and less than 10 MB"
                  isRequired
                  v-on:onFileChange="onImageChange"
                  v-on:delete="deleteImage"
                  :v="$v.form.blog.imageUrl"
                />
                <div v-for="(item, index) in form.blogTranslationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <InputText
                      textFloat="Alt Tag"
                      placeholder="Alt Tag"
                      type="text"
                      name="urlkey"
                      isRequired
                      v-model="item.altTag"
                      :img="imageLogoLang"
                      :isValidate="$v.form.blogTranslationList.$each.$iter[index].altTag.$error"
                      :v="$v.form.blogTranslationList.$each.$iter[index].altTag"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="URL Key"
                  placeholder="URL Key"
                  type="text"
                  name="urlkey"
                  isRequired
                  v-model="form.blog.urlKey"
                  :isValidate="$v.form.blog.urlKey.$error"
                  :v="$v.form.blog.urlKey"
                  @onKeyup="onUrlkeyChange"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Sort Order"
                  placeholder="Sort Order"
                  type="text"
                  name="sortorder"
                  v-model="form.blog.sortOrder"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>

            <SEOSection
              :data="form.blogTranslationList"
              :img="imageLogoLang"
              :langActive="languageActive"
              :isValidate="$v.form.blogTranslationList"
              :v="$v.form.blogTranslationList"
            />

            <b-row class="mt-4">
              <b-col>
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="form.blog.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span class="ml-2 main-label">{{form.blog.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button
                  class="btn btn-danger btn-details-set mr-md-2"
                  @click="deleteData()"
                  v-if="isEdit"
                  :disabled="isDisable"
                >REMOVE</b-button>
                <b-button href="/beautytips" class="btn-details-set" :disabled="isDisable">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="checkForm(0)"
                  :disabled="isDisable"
                  v-if="isEdit"
                >Save</button>
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="checkForm(1)"
                  :disabled="isDisable"
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
import InputTextArea from "@/components/inputs/InputTextArea";
import UploadFile from "@/components/inputs/UploadFile";
import Checkbox from "@/components/inputs/InputCheckBox";
import TextEditor from "@/components/inputs/TextEditor";
import SEOSection from "@/components/inputs/SEOSection";
import VueFroala from "vue-froala-wysiwyg";
import { required } from "vuelidate/lib/validators";
import Vue from "vue";
import ModalAlert from "@/components/ModalAlert";

export default {
  name: "BeautyTipsDetails",
  components: {
    InputText,
    InputTextArea,
    UploadFile,
    Checkbox,
    TextEditor,
    SEOSection,
    ModalAlert
  },
  data() {
    return {
      isHighlight: this.value,
      hasSameLanguage: this.value,
      isEdit: false,
      isLoadingData: false,
      isDisable: false,
      isSuccess: false,
      imgModal: null,
      msgModal: null,
      languageActive: 1,
      languageList: [],
      imageLogoLang: "",
      showPreview: "",
      modalAlertShow: false,
      dataForAlert: null,
      id: this.$route.params.id,
      form: {
        blog: {
          id: 0,
          enabled: false,
          blogCategoryId: 1,
          urlKey: null,
          imageUrl: "",
          sortOrder: 0,
          mainLanguageId: 0
        },
        isSameLanguage: false,
        blogTranslationList: [
          {
            blogId: 0,
            languageId: 1,
            name: null,
            shortDescription: null,
            description: null,
            metaTitle: null,
            metaKeyword: null,
            metaDescription: null,
            altTag: null
          },
          {
            blogId: 0,
            languageId: 2,
            name: null,
            shortDescription: null,
            description: null,
            metaTitle: null,
            metaKeyword: null,
            metaDescription: null,
            altTag: null
          }
        ],
        blogHighlight: false,
        imageBase64: null
      }
    };
  },
  validations: {
    form: {
      blog: {
        urlKey: { required },
        imageUrl: { required }
      },
      blogTranslationList: {
        $each: {
          name: { required },
          shortDescription: { required },
          description: { required },
          metaTitle: { required },
          metaKeyword: { required },
          metaDescription: { required },
          altTag: { required }
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
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/beautytips";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          window.location.href = "/beautytips";
        }
      }
    },
    changeBlogHighlight: function(value) {
      this.form.blogHighlight = value;
    },
    changeSameLang: function(value) {
      this.form.isSameLanguage = value;
    },
    onUrlkeyChange: function(value) {
      this.form.blog.urlKey = this.form.blog.urlKey
        .replace(/ /g, "-")
        .replace(/\//g, "");
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
        `${this.$baseUrl}/api/blog/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();
        
        if (this.form.blog.id > 0) {
          this.isEdit = true;
          this.isInit = true;
          this.form.imageBase64 = "";
          this.showPreview = this.form.blog.imageUrl;
        }
      }
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    onImageChange(img) {
      this.form.blog.imageUrl = img.name;
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => {
        this.showPreview = reader.result;
        this.form.imageBase64 = reader.result;
      };
    },
    deleteImage(value) {
      this.form.blog.imageUrl = null;
      this.form.imageBase64 = null;
      this.showPreview = null;
    },
    setMetaTitleandKeyword: function(name, index) {
      this.form.blogTranslationList[index].metaTitle = name;
      this.form.blogTranslationList[index].metaKeyword = name;
      this.form.blog.urlKey = name.replace(/ /g, "-").replace(/\//g, "");
      this.form.blogTranslationList[index].altTag = name.replace(/ /g, "-");
    },
    setMetaDescription: function(name, index) {
      this.form.blogTranslationList[index].metaDescription = name;
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
      this.form.blog.blogCategoryId = 1;
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/blog/save`,
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
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.isSameLanguage) {
          this.form.blog.mainLanguageId = this.languageActive;
          let data = this.form.blogTranslationList.filter(
            val => val.languageId == this.form.blog.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.blogTranslationList.length;
                index++
              ) {
                this.form.blogTranslationList[index].name = data.name;
                this.form.blogTranslationList[index].shortDescription =
                  data.shortDescription;
                this.form.blogTranslationList[index].description =
                  data.description;
                this.form.blogTranslationList[index].metaTitle = data.metaTitle;
                this.form.blogTranslationList[index].metaKeyword =
                  data.metaKeyword;
                this.form.blogTranslationList[index].metaDescription =
                  data.metaDescription;
                this.form.blogTranslationList[index].altTag = data.altTag;
              }
            }
          }
        } else {
          let data = this.form.blogTranslationList.filter(
            val => val.languageId != this.form.blog.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.name = "";
              data.shortDescription = "";
              data.description = "";
              data.metaTitle = "";
              data.metaKeyword = "";
              data.metaDescription = "";
              data.altTag = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList: async function() {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (this.$v.form.blogTranslationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.blogTranslationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    deleteData: async function() {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/blog/remove/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/beautytips";
        }
      }
    }
  }
};
</script>