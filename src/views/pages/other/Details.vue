    <template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Other Details</h1>
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
                    v-model="form.staticPage.isSameLanguage"
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
                  :disabled="form.staticPage.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <div v-for="(item, index) in form.staticPage.translationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <InputText
                      textFloat="Name"
                      placeholder="Name"
                      type="text"
                      name="name"
                      isRequired
                      v-model="item.name"
                      :img="imageLogoLang"
                      :isValidate="$v.form.staticPage.translationList.$each.$iter[index].name.$error"
                      :v="$v.form.staticPage.translationList.$each.$iter[index].name"
                      @onKeyup="setUrlKey(item.name,index)"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row class="mb-4">
              <b-col>
                <div v-for="(item, index) in form.staticPage.translationList" v-bind:key="index">
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
                          :v="$v.form.staticPage.translationList.$each.$iter[index].description"
                          @onDataChange="(val) => item.description = val"
                        />
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="6">
                <div class="position-relative">
                  <InputText
                    class="mb-4"
                    textFloat="URL Key"
                    placeholder="URL Key"
                    type="text"
                    name="email"
                    isRequired
                    v-model="form.staticPage.urlKey"
                    :isValidate="$v.form.staticPage.urlKey.$error"
                    :v="$v.form.staticPage.urlKey"
                    @onKeyup="onUrlkeyChange"
                  />
                  <!-- <a
                    :href="'http://verite.dosetech.co/'+form.staticPage.urlKey"
                    target="_blank"
                    class="view-txt"
                  >View</a> -->
                  <a
                    :href="'https://www.verite.co.th/'+form.staticPage.urlKey"
                    target="_blank"
                    class="view-txt"
                  >View</a>
                </div>
              </b-col>
              <b-col md="6">
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="form.staticPage.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span
                      class="ml-2 main-label"
                    >{{form.staticPage.enabled ? 'Active' : 'Inactive' }}</span>
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
                <b-button href="/other" :disabled="isDisable" class="btn-details-set">CANCEL</b-button>
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
import { required } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";

export default {
  name: "OtherDetails",
  components: {
    InputText,
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
        staticPage: {
          id: 0,
          urlKey: null,
          enabled: false,
          mainLanguageId: 1,
          isSameLanguage: true,
          translationList: [
            {
              languageId: 1,
              name: null,
              description: null
            },
            {
              languageId: 2,
              name: null,
              description: null
            }
          ]
        }
      }
    };
  },
  validations: {
    form: {
      staticPage: {
        urlKey: { required },
        translationList: {
          $each: {
            name: { required },
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
    onUrlkeyChange: function(value) {
      this.form.staticPage.urlKey = this.form.staticPage.urlKey
        .replace(/ /g, "-")
        .replace(/\//g, "");
    },
    setUrlKey: function(name, index) {
      if (this.id == 0) {
        this.form.staticPage.urlKey = name
          .replace(/ /g, "-")
          .replace(/\//g, "");
      }
    },
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/other";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          window.location.href = "/other";
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
        `${this.$baseUrl}/api/staticPage/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.form.staticPage.id > 0) {
          this.isEdit = true;
        }

        if (this.form.staticPage.isSameLanguage) {
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
        if (this.form.staticPage.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.staticPage.mainLanguageId = this.languageActive;
          let data = this.form.staticPage.translationList.filter(
            val => val.languageId == this.form.staticPage.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.staticPage.translationList.length;
                index++
              ) {
                this.form.staticPage.translationList[index].name = data.name;
                this.form.staticPage.translationList[index].description =
                  data.description;
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

          let data = this.form.staticPage.translationList.filter(
            val => val.languageId != this.form.staticPage.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.description = "";
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
            this.$v.form.staticPage.translationList.$each.$iter[index].$error
          ) {
            this.languageActive = this.$v.form.staticPage.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    checkForm: async function(flag) {
      if (this.form.staticPage.isSameLanguage) {
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
        `${this.$baseUrl}/api/staticPage/save`,
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
          `${this.$baseUrl}/api/staticPage/remove/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/other";
        }
      }
    }
  }
};
</script>

<style scoped>
.view-txt {
  position: absolute;
  right: 0;
  top: 0;
  text-decoration: underline;
  color: #707070;
  z-index: 1;
}
</style>