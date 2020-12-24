<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">FAQ Details</h1>
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
                    v-model="form.faq.isSameLanguage"
                    class="mt-0 mt-sm-3"
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
                  :disabled="form.faq.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <div v-for="(item, index) in form.faq.translationList" v-bind:key="index">
              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <b-row>
                  <b-col>
                    <InputText
                      class="my-4"
                      textFloat="Question"
                      placeholder="Question"
                      type="text"
                      name="name"
                      isRequired
                      :img="imageLogoLang"
                      v-model="item.question"
                      :isValidate="$v.form.faq.translationList.$each.$iter[index].question.$error"
                      :v="$v.form.faq.translationList.$each.$iter[index].question"
                    />
                  </b-col>
                </b-row>
              </div>

              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <b-row>
                  <b-col>
                    <TextEditor
                      textFloat="Answer"
                      :rows="8"
                      :value="item.answer"
                      :name="'description_'+item.languageId"
                      :img="imageLogoLang"
                      placeholder="Type something..."
                      isRequired
                      :v="$v.form.faq.translationList.$each.$iter[index].answer"
                      @onDataChange="(val) => item.answer = val"
                    />
                  </b-col>
                </b-row>
              </div>
            </div>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Sort Order"
                  placeholder="Sort Order"
                  type="text"
                  name="sortorder"
                  @onKeypress="isNumber($event)"
                  v-model="form.faq.sortOrder"
                />
              </b-col>
              <b-col md="6">
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox switch v-model="form.faq.enabled" class="radio-active" size="lg">
                    <span class="ml-2 main-label">{{form.faq.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <!-- <b-button
                  class="btn btn-danger btn-details-set mr-md-2"
                  @click="deleteData()"
                  v-if="isEdit"
                  :disabled="isDisable"
                >REMOVE</b-button>-->
                <router-link :to="{ path: '/faq/details/'+ this.faqTopicId}">
                  <b-button class="btn-details-set" :disabled="isDisable">BACK</b-button>
                </router-link>
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
import TextEditor from "@/components/inputs/TextEditor";
import { required } from "vuelidate/lib/validators";
import Vue from "vue";
import ModalAlert from "@/components/ModalAlert";
import VueCookies from "vue-cookies";

export default {
  name: "FaqQuestionDetails",
  components: {
    InputText,
    TextEditor,
    ModalAlert
  },
  data() {
    return {
      isEdit: false,
      isDisable: false,
      isSuccess: false,
      isLoadingData: false,
      imgModal: null,
      msgModal: null,
      languageList: [],
      imageLogoLang: "",
      existId: "",
      languageActive: 1,
      faqTopicId: 0,
      modalAlertShow: false,
      id: this.$route.params.id,
      form: {
        faq: {
          id: 0,
          faqTopicId: 0,
          enabled: false,
          sortOrder: 0,
          mainLanguageId: 0,
          isSameLanguage: false,
          translationList: [
            {
              languageId: 1,
              question: null,
              answer: null
            },
            {
              languageId: 2,
              question: null,
              answer: null
            }
          ]
        }
      }
    };
  },
  validations: {
    form: {
      faq: {
        translationList: {
          $each: {
            question: { required },
            answer: { required }
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
        window.location.href = `/faq/details/${this.faqTopicId}`;
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          this.form.faq.id = this.existId;
          this.id = this.existId;
          this.isEdit = true;
          this.$router.push({ path: `/faq/details/question/${this.existId}` });
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
        `${this.$baseUrl}/api/faq/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.form.faq.id > 0) {
          this.isEdit = true;
        }

        if (this.form.faq.isSameLanguage) {
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

      this.faqTopicId = VueCookies.get("faq_topic_id");
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    checkForm: async function(flag) {
      if (this.form.faq.isSameLanguage) {
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
      this.form.faq.faqTopicId = parseInt(this.faqTopicId);
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/FAQ/save`,
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
        this.msgModal = data.message;
        this.isSuccess = false;
      }

      this.isDisable = false;
    },
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.faq.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.faq.mainLanguageId = this.languageActive;
          let data = this.form.faq.translationList.filter(
            val => val.languageId == this.form.faq.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.faq.translationList.length;
                index++
              ) {
                this.form.faq.translationList[index].question = data.question;
                this.form.faq.translationList[index].answer = data.answer;
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

          let data = this.form.faq.translationList.filter(
            val => val.languageId != this.form.faq.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.question = "";
              data.answer = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList: async function() {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (this.$v.form.faq.translationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.faq.translationList.$model[
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
          `${this.$baseUrl}/api/faq/remove/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/faq";
        }
      }
    }
  }
};
</script>