<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Video Details</h1>
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
                    id="highlight"
                    v-model="form.videoHighlight"
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

            <div v-for="(item, index) in form.videoTranslationList" v-bind:key="index">
              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <b-row>
                  <b-col>
                    <InputText
                      class="mb-4"
                      textFloat="Video Name"
                      placeholder="Video Name"
                      type="text"
                      name="name"
                      isRequired
                      v-model="item.name"
                      :img="imageLogoLang"
                      @onKeyup="setMetaTitleandKeyword(item.name,index)"
                      :isValidate="$v.form.videoTranslationList.$each.$iter[index].name.$error"
                      :v="$v.form.videoTranslationList.$each.$iter[index].name"
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
                      :isValidate="$v.form.videoTranslationList.$each.$iter[index].shortDescription.$error"
                      :v="$v.form.videoTranslationList.$each.$iter[index].shortDescription"
                    />
                    <!-- :keyup="setMetaDescription(item.shortDescription,index)" -->
                  </b-col>
                </b-row>
              </div>

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
                      :v="$v.form.videoTranslationList.$each.$iter[index].description"
                      @onDataChange="(val) => item.description = val"
                    />
                  </b-col>
                </b-row>
              </div>
            </div>

            <b-row class="mb-3">
              <b-col md="6">
                <label class="label-text mb-2">Video Type</label>
                <b-row class="mb-3 mb-sm-0">
                  <b-col
                    md="6"
                    class="mb-1 mb-sm-0"
                    v-for="(item,index) in form.videoType"
                    v-bind:key="index"
                  >
                    <b-form-radio
                      name="some-type"
                      v-model="form.video.videoTypeId"
                      :value="item.id"
                      @change="onChangeVideoType"
                    >{{item.name}}</b-form-radio>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <b-row class="mb-3">
              <b-col>
                <InputText
                  textFloat="Youtube Link"
                  placeholder="ex. https://www.youtube.com/watch?v=yWPJg1ZW3P0, http://youtu.be/yWPJg1ZW3P0"
                  type="text"
                  name="link"
                  v-model="form.video.videoUrl"
                  :v="$v.form.video.videoUrl"
                  v-if="form.video.videoTypeId == 2"
                  isRequired
                  class="mt-1"
                />
                <span
                  class="view-txt"
                  @click="previewYtVideo"
                  v-if="form.video.videoTypeId == 2"
                >Preview</span>
                <p class="text-danger" v-if="!isYtLink">Please enter a valid youtube link</p>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div>
                  <UploadFile
                    textFloat="Video File"
                    placeholder="Please choose file"
                    format="video"
                    :fileName="form.video.videoUrl"
                    v-model="form.video.videoUrl"
                    name="video"
                    text="*Please upload only file .mp4 size less than 50 MB"
                    isRequired
                    v-on:onFileChange="onVideoChange"
                    v-on:delete="deleteVideo"
                    :v="$v.form.video.videoUrl"
                    v-if="form.video.videoTypeId == 1"
                  />

                  <label class="label-text mb-2" v-if="form.video.videoTypeId == 2">Youtube Video</label>
                  <div
                    class="preview-box position-relative video-thumbnail"
                    :class="{'yt-box':form.video.videoTypeId == 2}"
                  >
                    <video
                      ref="videoRef"
                      class="w-100 video-box"
                      controls
                      v-if="form.video.videoTypeId == 1"
                    >
                      <source :src="showVideo" type="video/mp4" />
                    </video>

                    <iframe width="100%" height="300" :src="showVideo" v-else></iframe>
                    <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoadingVideo" />
                  </div>
                </div>
              </b-col>
              <b-col md="6">
                <UploadFile
                  textFloat="Video Thumbnail"
                  placeholder="Please choose file"
                  format="image"
                  :fileName="form.video.coverImageUrl"
                  v-model="form.video.coverImageUrl"
                  name="thumbnail"
                  text="*Please upload only file .png, .jpg size 1078 x 1079 px and less than 10 MB"
                  isRequired
                  v-on:onFileChange="onImageChange"
                  v-on:delete="deleteImage"
                  :v="$v.form.video.coverImageUrl"
                  v-if="form.video.videoTypeId == 1"
                />

                <!-- <label class="label-text mb-2" v-if="form.video.videoTypeId == 2">Youtube Thumbnail</label> -->
                <div
                  class="preview-box video-thumbnail"
                  :style="{ backgroundImage: `url('${showPreview}')` }"
                   v-if="form.video.videoTypeId == 1"
                >
                  <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoadingImage" />
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Sort Order"
                  placeholder="Sort Order"
                  type="number"
                  name="sortorder"
                  v-model="form.video.sortOrder"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="URL Key"
                  placeholder="URL Key"
                  type="text"
                  name="urlkey"
                  isRequired
                  v-model="form.video.urlKey"
                  :isValidate="$v.form.video.urlKey.$error"
                  :v="$v.form.video.urlKey"
                  @onKeyup="onUrlkeyChange"
                />
              </b-col>
            </b-row>

            <SEOSection
              :data="form.videoTranslationList"
              :img="imageLogoLang"
              :langActive="languageActive"
              :isValidate="$v.form.videoTranslationList"
              :v="$v.form.videoTranslationList"
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
                    v-model="form.video.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span class="ml-2 main-label">{{form.video.enabled ? 'Active' : 'Inactive' }}</span>
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
                <b-button href="/video" class="btn-details-set" :disabled="isDisable">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="checkForm(0)"
                  :disabled="isDisable"
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
import TextEditor from "@/components/inputs/TextEditor";
import SEOSection from "@/components/inputs/SEOSection";
import { required, requiredIf } from "vuelidate/lib/validators";
import Vue from "vue";
import ModalAlert from "@/components/ModalAlert";

export default {
  name: "VideoDetails",
  components: {
    InputText,
    InputTextArea,
    UploadFile,
    TextEditor,
    SEOSection,
    ModalAlert,
  },
  data() {
    return {
      id: this.$route.params.id,
      existId: "",
      isLoadingImage: false,
      isLoadingVideo: false,
      images: "",
      isEdit: false,
      isDisable: false,
      isSuccess: false,
      isLoadingData: false,
      imgModal: null,
      msgModal: null,
      languageActive: 1,
      languageList: [],
      imageLogoLang: "",
      showPreview: "",
      showVideo: "",
      modalAlertShow: false,
      dataForAlert: null,
      isYtLink: true,
      form: {
        video: {
          id: 0,
          enabled: false,
          videoUrl: null,
          coverImageUrl: null,
          sortOrder: 0,
          urlKey: null,
          mainLanguageId: 0,
        },
        isSameLanguage: false,
        videoTranslationList: [
          {
            videoId: 0,
            languageId: 1,
            altTag: null,
            coverImageAltTag: null,
            name: null,
            description: null,
            shortDescription: null,
            metaTitle: null,
            metaKeyword: null,
            metaDescription: null,
          },
          {
            videoId: 0,
            languageId: 2,
            altTag: null,
            coverImageAltTag: null,
            name: null,
            description: null,
            shortDescription: null,
            metaTitle: null,
            metaKeyword: null,
            metaDescription: null,
          },
        ],
        videoHighlight: false,
        thumbnailImageBase64: null,
        videoBase64: null,
      },
    };
  },
  validations: {
    form: {
      video: {
        urlKey: { required },
        videoUrl: { required },
        coverImageUrl: {
          required: requiredIf(function () {
            return this.form.video.videoTypeId == 1;
          }),
        },
      },
      videoTranslationList: {
        $each: {
          name: { required },
          shortDescription: { required },
          description: { required },
          metaTitle: { required },
          metaKeyword: { required },
          metaDescription: { required },
        },
      },
    },
  },
  created: async function () {
    await this.getDatas();
  },
  methods: {
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    handleCloseModal: function () {
      if (this.flag == 1) {
        window.location.href = "/video";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          this.form.video.id = this.existId;
          this.id = this.existId;
          this.isEdit = true;
          this.$router.push({ path: `/video/details/${this.existId}` });
        }
      }
    },
    changeBlogHighlight: function (value) {
      this.form.videoHighlight = value;
    },
    changeSameLang: function (value) {
      this.form.isSameLanguage = value;
    },
    onUrlkeyChange: function (value) {
      this.form.video.urlKey = this.form.video.urlKey
        .replace(/ /g, "-")
        .replace(/\//g, "");
    },
    getDatas: async function () {
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
        `${this.$baseUrl}/api/video/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.form.video.id > 0) {
          this.isEdit = true;
          this.form.videoBase64 = "";
          this.form.thumbnailImageBase64 = "";
          this.showVideo = this.form.video.videoUrl;
          if (this.form.video.videoTypeId == 1) {
            this.showPreview = this.form.video.coverImageUrl;
            var vid = this.$refs.videoRef;
            vid.load();
          } else {
            await this.setYtVideo();
            await this.setYtImg();
          }
        }

        if (this.form.isSameLanguage) {
          this.imageLogoLang = "";
        } else {
          var index = this.languageList
            .map(function (x) {
              return x.id;
            })
            .indexOf(this.languageActive);
          this.imageLogoLang = this.languageList[index].imageUrl;
        }
      }
    },
    setYtImg() {
      var a = this.form.video.videoUrl.split("/").pop();
      this.showPreview = "https://i.ytimg.com/vi/" + a + "/0.jpg";
    },
    setYtVideo() {
      var x = this.form.video.videoUrl.indexOf("embed");
      var a = this.form.video.videoUrl.split("=").pop();
      var b = this.form.video.videoUrl.split("/").pop();
      if (x == -1) {
        if (this.form.video.videoUrl.includes("youtube")) {
          this.showVideo = "https://www.youtube.com/embed/" + a + "";
          this.form.video.videoUrl = "https://www.youtube.com/embed/" + a + "";
        } else {
          this.showVideo = "https://www.youtube.com/embed/" + b + "";
          this.form.video.videoUrl = "https://www.youtube.com/embed/" + b + "";
        }
      }
    },
    previewYtVideo: async function () {
      var validLink = this.form.video.videoUrl;

      if (
        validLink.indexOf("youtube") != -1 ||
        validLink.indexOf("youtu.be") != -1
      ) {
        this.isYtLink = true;
        await this.setYtVideo();
        await this.setYtImg();
      } else {
        this.isYtLink = false;
        return;
      }
    },
    onChangeVideoType() {
      this.form.video.coverImageUrl = null;
      this.form.video.videoUrl = null;
      this.showPreview = null;
      this.showVideo = null;
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
        this.form.video.coverImageUrl = this.images;
      };
    },
    onVideoChange(video) {
      this.isLoadingVideo = true;
      this.isDisable = true;

      var reader = new FileReader();
      reader.readAsDataURL(video);

      reader.onload = async () => {
        this.images = await this.saveImagetoDb(reader.result);
        this.isLoadingVideo = false;
        this.isDisable = false;

        this.showVideo = this.images;
        this.form.video.videoUrl = this.images;

        var vid = this.$refs.videoRef;
        vid.load();
      };
    },
    saveImagetoDb: async function (img) {
      var imgData = {
        base64: img,
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
      this.form.video.coverImageUrl = null;
      this.form.thumbnailImageBase64 = null;
      this.showPreview = null;
    },
    deleteVideo(value) {
      this.form.video.videoUrl = null;
      this.form.videoBase64 = null;
      this.showVideo = "";
      var vid = this.$refs.videoRef;
      vid.load();
    },
    setMetaTitleandKeyword: function (name, index) {
      this.form.videoTranslationList[index].metaTitle = name;
      this.form.videoTranslationList[index].metaKeyword = name;
      this.form.video.urlKey = name.replace(/ /g, "-").replace(/\//g, "");
      this.form.videoTranslationList[index].altTag = name.replace(/ /g, "-");
      this.form.videoTranslationList[index].coverImageAltTag = name.replace(
        / /g,
        "-"
      );
    },
    setMetaDescription: function (name, index) {
      this.form.videoTranslationList[index].metaDescription = name;
    },
    checkForm: async function (flag) {
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

      if (this.form.video.videoTypeId == 2) {
        var validLink = this.form.video.videoUrl;

        if (
          validLink.indexOf("youtube") != -1 ||
          validLink.indexOf("youtu.be") != -1
        ) {
          this.isYtLink = true;
          await this.setYtVideo();
          await this.setYtImg();
        } else {
          this.isYtLink = false;
          return;
        }
      }

      this.submit();
    },
    submit: async function () {
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/video/save`,
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
    useSameLanguage: async function () {
      Vue.nextTick(() => {
        if (this.form.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.video.mainLanguageId = this.languageActive;
          let data = this.form.videoTranslationList.filter(
            (val) => val.languageId == this.form.video.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.videoTranslationList.length;
                index++
              ) {
                this.form.videoTranslationList[index].name = data.name;
                this.form.videoTranslationList[index].shortDescription =
                  data.shortDescription;
                this.form.videoTranslationList[index].description =
                  data.description;
                this.form.videoTranslationList[index].metaTitle =
                  data.metaTitle;
                this.form.videoTranslationList[index].metaKeyword =
                  data.metaKeyword;
                this.form.videoTranslationList[index].metaDescription =
                  data.metaDescription;
                this.form.videoTranslationList[index].altTag = data.altTag;
                this.form.videoTranslationList[index].coverImageAltTag =
                  data.coverImageAltTag;
              }
            }
          }
        } else {
          var index = this.languageList
            .map(function (x) {
              return x.id;
            })
            .indexOf(this.languageActive);
          this.imageLogoLang = this.languageList[index].imageUrl;

          let data = this.form.videoTranslationList.filter(
            (val) => val.languageId != this.form.video.mainLanguageId
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
              data.coverImageAltTag = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList: async function () {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (this.$v.form.videoTranslationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.videoTranslationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    deleteData: async function () {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/video/remove/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/video";
        }
      }
    },
  },
};
</script>

<style scoped>
.video-box {
  position: absolute;
  top: 50%;
  left: 50%;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
}

.view-txt {
  position: absolute;
  right: 15px;
  top: 0;
  text-decoration: underline;
  color: #707070;
  z-index: 1;
  cursor: pointer;
}
</style>