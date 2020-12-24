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
                    v-model="form.faqTopic.isSameLanguage"
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
                  :disabled="form.faqTopic.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <div v-for="(item, index) in form.faqTopic.translationList" v-bind:key="index">
              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <b-row>
                  <b-col>
                    <InputText
                      textFloat="Topic"
                      placeholder="Topic"
                      type="text"
                      name="name"
                      isRequired
                      :img="imageLogoLang"
                      v-model="item.name"
                      :isValidate="$v.form.faqTopic.translationList.$each.$iter[index].name.$error"
                      :v="$v.form.faqTopic.translationList.$each.$iter[index].name"
                    />
                  </b-col>
                </b-row>
              </div>
            </div>

            <b-row class="mt-3">
              <b-col md="6">
                <InputText
                  textFloat="Sort Order"
                  placeholder="Sort Order"
                  type="text"
                  name="sortorder"
                  v-model="form.faqTopic.sortOrder"
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
                    v-model="form.faqTopic.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span class="ml-2 main-label">{{form.faqTopic.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <div v-if="id > 0">
              <HeaderLine text="Question" class="my-4" />
              <div class="text-right mt-3">
                <router-link to="/faq/details/question/0">
                  <b-button class="btn-main mb-3">Add</b-button>
                </router-link>
              </div>

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
                  <template v-slot:cell(status)="data">
                    <div v-if="data.item.status == true" class="text-success">Active</div>
                    <div v-else class="text-danger">Inactive</div>
                  </template>
                  <template v-slot:cell(id)="data">
                    <div class="d-flex justify-content-center">
                      <router-link :to="{ path: '/faq/details/question/'+ data.item.id}">
                        <b-button variant="link" class="text-warning px-1 py-0">
                          <font-awesome-icon icon="pencil-alt" title="Edit" />
                        </b-button>
                      </router-link>
                      <b-button
                        variant="link"
                        class="text-danger px-1 py-0"
                        @click="deleteQuestion(data.item.id)"
                      >
                        <font-awesome-icon icon="trash-alt" title="Delete" />
                      </b-button>
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
            </div>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button
                  class="btn btn-danger btn-details-set mr-md-2"
                  @click="deleteData()"
                  v-if="isEdit"
                  :disabled="isDisable"
                >REMOVE</b-button>
                <b-button href="/faq" class="btn-details-set" :disabled="isDisable">CANCEL</b-button>
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
import { required } from "vuelidate/lib/validators";
import Vue from "vue";
import ModalAlert from "@/components/ModalAlert";
import HeaderLine from "@/components/HeaderLine";

export default {
  name: "BannerDetails",
  components: {
    InputText,
    ModalAlert,
    HeaderLine
  },
  data() {
    return {
      isEdit: false,
      isBusy: false,
      existId: "",
      isLoadingData: false,
      isDisable: false,
      isSuccess: false,
      imgModal: null,
      msgModal: null,
      languageList: [],
      items: [],
      imageLogoLang: "",
      languageActive: 1,
      modalAlertShow: false,
      id: this.$route.params.id,
      fields: [
        {
          key: "question",
          label: "Question",
          class: "w-200"
        },
        {
          key: "sortOrder",
          label: "Sort Order",
          class: "w-100px"
        },
        {
          key: "status",
          label: "Status"
        },
        {
          key: "id",
          label: "Action",
          class: "w-100px"
        }
      ],
      form: {
        faqTopic: {
          id: 1,
          enabled: true,
          sortOrder: 2,
          mainLanguageId: 0,
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
        }
      }
    };
  },
  validations: {
    form: {
      faqTopic: {
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
    await this.getQuestionList();
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
        window.location.href = "/faq";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          this.form.faqTopic.id = this.existId;
          this.id = this.existId;
          this.$cookies.set("faq_topic_id", this.id, 60 * 60 * 24 * 30);
          this.isEdit = true;
          this.$router.push({ path: `/faq/details/${this.existId}` });
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
        `${this.$baseUrl}/api/FAQ/topic/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.form.faqTopic.id > 0) {
          this.isEdit = true;
        }

        if (this.form.faqTopic.isSameLanguage) {
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

      await this.$cookies.set("faq_topic_id", this.id, 60 * 60 * 24 * 30);
    },
    getQuestionList: async function() {
      this.isBusy = true;

      let question = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/FAQ/list/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (question.result == 1) {
        this.items = question.detail.faqList;
      }

      this.isBusy = false;
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    checkForm: async function(flag) {
      if (this.form.faqTopic.isSameLanguage) {
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
        `${this.$baseUrl}/api/FAQ/saveTopic`,
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
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.faqTopic.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.faqTopic.mainLanguageId = this.languageActive;
          let data = this.form.faqTopic.translationList.filter(
            val => val.languageId == this.form.faqTopic.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.faqTopic.translationList.length;
                index++
              ) {
                this.form.faqTopic.translationList[index].name = data.name;
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

          let data = this.form.faqTopic.translationList.filter(
            val => val.languageId != this.form.faqTopic.mainLanguageId
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
          if (this.$v.form.faqTopic.translationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.faqTopic.translationList.$model[
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
          `${this.$baseUrl}/api/FAQ/removeTopic/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/faq";
        }
      }
    },
    deleteQuestion: async function(id) {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/FAQ/remove/${id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          this.getQuestionList();
        }
      }
    }
  }
};
</script>