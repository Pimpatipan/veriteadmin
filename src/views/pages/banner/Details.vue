<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Banner Details</h1>
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
                    @change="useSameLanguage"
                    id="sameLang"
                    class="mt-0 mt-sm-3"
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

            <b-row>
              <b-col>
                <InputText
                  textFloat="Banner Name"
                  placeholder="Banner Name"
                  type="text"
                  name="name"
                  isRequired
                  v-model="form.banner.name"
                  :isValidate="$v.form.banner.name.$error"
                  :v="$v.form.banner.name"
                  @onKeyup="setAlttag(form.banner.name)"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Link URL"
                  placeholder="Link URL"
                  type="text"
                  name="linkurl"
                  v-model="form.banner.linkUrl"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Sort Order"
                  placeholder="Sort Order"
                  type="text"
                  name="sortorder"
                  @onKeypress="isNumber($event)"
                  v-model="form.banner.sortOrder"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div
                  class="preview-box b-contain"
                  v-if="coverImgType == 1"
                  v-bind:style="{ 'background-image': 'url(' + showPreview + ')' }"
                >
                  <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoadingImage" />
                </div>
                <div
                  class="preview-box position-relative p-0 embed-responsive embed-responsive-16by9 banner-video"
                  v-else
                >
                  <video ref="videoRef" class="w-100 video-box" controls>
                    <source :src="showPreview" type="video/mp4" />
                  </video>
                </div>
              </b-col>
              <b-col md="6">
                <UploadFile
                  textFloat="Cover Image"
                  placeholder="Please choose file"
                  format="all"
                  :fileName="form.banner.imageUrl"
                  v-model="form.banner.imageUrl"
                  name="thumbnail"
                  text="*Please upload only file .png, .jpg size 1110 x 477 px and .mp4 less than 50 MB"
                  isRequired
                  v-on:onFileChange="onImageChange"
                  v-on:delete="deleteImage"
                  :v="$v.form.banner.imageUrl"
                />
                <div v-for="(item, index) in form.bannerTranslationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <InputText
                      textFloat="Alt Tag"
                      placeholder="Alt Tag"
                      type="text"
                      name="urlkey"
                      isRequired
                      v-model="item.altTag"
                      :img="imageLogoLang"
                      :isValidate="$v.form.bannerTranslationList.$each.$iter[index].altTag.$error"
                      :v="$v.form.bannerTranslationList.$each.$iter[index].altTag"
                      @onKeyup="setAlttagByLang(item.altTag,index)"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-4">
              <b-col>
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="form.banner.display"
                    class="radio-active"
                    size="lg"
                  >
                    <span class="ml-2 main-label">{{form.banner.display ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button
                  v-if="isEdit"
                  class="btn btn-danger btn-details-set mr-md-2"
                  :disabled="isDisable"
                  @click="deleteData()"
                >REMOVE</b-button>
                <b-button href="/banner" :disabled="isDisable" class="btn-details-set">CANCEL</b-button>
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
import UploadFile from "@/components/inputs/UploadFile";
import { required } from "vuelidate/lib/validators";
import Vue from "vue";
import ModalAlert from "@/components/ModalAlert";

export default {
  name: "BannerDetails",
  components: {
    InputText,
    UploadFile,
    ModalAlert
  },
  data() {
    return {
      id: this.$route.params.id,
      existId: "",
      isEdit: false,
      isLoadingData: false,
      isLoadingImage: false,
      isDisable: false,
      isSuccess: false,
      imgModal: null,
      msgModal: null,
      languageActive: 1,
      languageList: [],
      imageLogoLang: "",
      images: "",
      coverImgType: 1,
      showVideo: "",
      showPreview: "",
      modalAlertShow: false,
      form: {
        banner: {
          id: 0,
          name: null,
          linkUrl: null,
          imageUrl: "",
          isVideo: false,
          display: false,
          sortOrder: 0,
          mainLanguageId: 0
        },
        imageBase64: null,
        isSameLanguage: false,
        bannerTranslationList: [
          {
            bannerId: 0,
            languageId: 1,
            altTag: null
          },
          {
            bannerId: 0,
            languageId: 2,
            altTag: null
          }
        ]
      }
    };
  },
  validations: {
    form: {
      banner: {
        name: { required },
        imageUrl: { required }
      },
      bannerTranslationList: {
        $each: {
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
    changeSameLang: function(value) {
      this.form.isSameLanguage = value;
    },
    setAlttag: function(value) {
      this.languageList.forEach((element, index) => {
        this.form.bannerTranslationList[index].altTag = value.replace(
          / /g,
          "-"
        );
      });
    },
    setAlttagByLang: function(value, index) {
      this.form.bannerTranslationList[index].altTag = value.replace(/ /g, "-");
    },
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/banner";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          this.form.banner.id = this.existId;
          this.id = this.existId;
          this.isEdit = true;
          this.$router.push({ path: `/banner/details/${this.existId}` });
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
        `${this.$baseUrl}/api/banner/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.form.banner.id > 0) {
          this.isEdit = true;
          this.form.imageBase64 = "";

          this.showPreview = this.form.banner.imageUrl;

          let vdo = this.form.banner.imageUrl.split(".").pop();
          if (vdo == "mp4") {
            this.coverImgType = 2;
            var vid = this.$refs.videoRef;
            if (vid != undefined) {
              vid.load();
            }
          }
        }
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
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    onImageChange(img) {
      this.isLoadingImage = true;
      this.isDisable = true;

      var reader = new FileReader();
      reader.readAsDataURL(img);

      reader.onload = async () => {
        this.images = await this.saveImagetoDb(reader.result);
        this.isLoadingImage = false;
        this.isDisable = false;

        this.showPreview = this.images;
        this.form.banner.imageUrl = this.images;

        if (img.type == "video/mp4") {
          this.coverImgType = 2;
          this.form.banner.isVideo = true;
          var vid = this.$refs.videoRef;
          if (vid != undefined) {
            vid.load();
          }
        } else {
          this.coverImgType = 1;
          this.form.banner.isVideo = false;
        }
      };
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
    deleteImage(value) {
      this.form.banner.imageUrl = null;
      this.form.imageBase64 = null;
      this.showPreview = null;

      if (this.coverImgType == 2) {
        var vid = this.$refs.videoRef;
        vid.load();
        this.coverImgType = 1;
      }
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
        `${this.$baseUrl}/api/banner/save`,
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
        if (this.form.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.banner.mainLanguageId = this.languageActive;
          let data = this.form.bannerTranslationList.filter(
            val => val.languageId == this.form.banner.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.bannerTranslationList.length;
                index++
              ) {
                this.form.bannerTranslationList[index].altTag = data.altTag;
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

          let data = this.form.bannerTranslationList.filter(
            val => val.languageId != this.form.banner.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
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
          if (this.$v.form.bannerTranslationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.bannerTranslationList.$model[
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
          `${this.$baseUrl}/api/banner/remove/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/banner";
        }
      }
    }
  }
};
</script>

<style scoped>
.panel {
  font-size: 17px;
  color: #16274a;
}
.b-contain {
  padding-bottom: 42.9%;
}
.banner-video::before {
  padding-top: 42.9%;
}
</style>