<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Career Details</h1>
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
                    id="sameLang"
                    class="mt-0 mt-sm-3"
                    @change="useSameLanguage"
                    v-model="form.career.isSameLanguage"
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
                  :disabled="form.career.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <InputText
                  textFloat="Career Name"
                  placeholder="Career Name"
                  type="text"
                  name="name"
                  isRequired
                  v-model="form.career.name"
                  :isValidate="$v.form.career.name.$error"
                  :v="$v.form.career.name"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  class="mb-4"
                  textFloat="Vacancies"
                  placeholder="Vacancies"
                  type="text"
                  name="name"
                  isRequired
                  v-model="form.career.vacancies"
                  :isValidate="$v.form.career.vacancies.$error"
                  :v="$v.form.career.vacancies"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  class="mb-4"
                  textFloat="Email"
                  placeholder="Email"
                  type="text"
                  name="email"
                  isRequired
                  v-model="form.career.email"
                  :isValidate="$v.form.career.email.$error"
                  :v="$v.form.career.email"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <UploadFile
                  textFloat="Application File"
                  placeholder="Please choose file"
                  format="pdf"
                  name="file"
                  text="*Please upload only file size less than 10 MB"
                  isRequired
                  :fileName="form.career.fileUrl"
                  v-model="form.career.fileUrl"
                  v-on:onFileChange="onFileChange"
                  v-on:delete="deleteFile"
                  :v="$v.form.career.fileUrl"
                />
              </b-col>
            </b-row>

            <b-row class="mb-4">
              <b-col>
                <div v-for="(item, index) in form.career.translationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <b-row>
                      <b-col>
                        <TextEditor
                          textFloat="Description"
                          :rows="8"
                          :value="item.description"
                          :name="'description_'+item.languageId"
                          :img="imageLogoLang"
                          placeholder="Type something..."
                          isRequired
                          :v="$v.form.career.translationList.$each.$iter[index].description"
                          @onDataChange="(val) => item.description = val"
                        />
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col>
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="form.career.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span class="ml-2 main-label">{{form.career.enabled ? 'Active' : 'Inactive' }}</span>
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
                <b-button href="/career" :disabled="isDisable" class="btn-details-set">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  v-if="isEdit"
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
import TextEditor from "@/components/inputs/TextEditor";
import UploadFile from "@/components/inputs/UploadFile";
import { required } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";

export default {
  name: "CareerDetails",
  components: {
    InputText,
    UploadFile,
    ModalAlert,
    TextEditor
  },
  data() {
    return {
      languageList: [],
      imageLogoLang: "",
      languageActive: 1,
      isEdit: false,
      isLoadingData: false,
      isDisable: false,
      imgModal: null,
      msgModal: null,
      id: this.$route.params.id,
      modalAlertShow: false,
      form: {
        career: {
          id: 0,
          enabled: false,
          name: null,
          vacancies: 0,
          email: null,
          fileUrl: "",
          sortOrder: 0,
          mainLanguageId: 0,
          isSameLanguage: false,
          translationList: [
            {
              languageId: 1,
              description: null
            },
            {
              languageId: 2,
              description: null
            }
          ]
        }
      }
    };
  },
  validations: {
    form: {
      career: {
        name: { required },
        vacancies: { required },
        email: { required },
        fileUrl: { required },
        translationList: {
          $each: {
            description: { required }
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
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/career";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          window.location.href = "/career";
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
        `${this.$baseUrl}/api/career/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();
        
        if (this.form.career.id > 0) {
          this.isEdit = true;
        }
      }
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.career.isSameLanguage) {
          this.form.career.mainLanguageId = this.languageActive;
          let data = this.form.career.translationList.filter(
            val => val.languageId == this.form.career.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.career.translationList.length;
                index++
              ) {
                this.form.career.translationList[index].description =
                  data.description;
              }
            }
          }
        } else {
          let data = this.form.career.translationList.filter(
            val => val.languageId != this.form.career.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.description = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList: async function() {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (this.$v.form.career.translationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.career.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    checkForm: async function(flag) {
      if (this.form.career.isSameLanguage) {
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
        `${this.$baseUrl}/api/career/saveCareer`,
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
    onFileChange(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        this.files = await this.saveFiletoDb(reader.result);
        this.form.career.fileUrl = this.files;
      };
    },
    deleteFile(value) {
      this.form.career.fileUrl = null;
    },
    deleteData: async function() {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/career/removeCareer/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/career";
        }
      }
    },
    saveFiletoDb: async function(file) {
      var filedata = {
        base64: file
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/career/saveFile`,
        null,
        this.$headers,
        filedata
      );

      if (data.result == 1) {
        return data.detail.path;
      }
    }
  }
};
</script>