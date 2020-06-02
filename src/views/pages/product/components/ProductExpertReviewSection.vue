<template>
  <div>
    <form action>
      <b-row class="no-gutters bg-white-border">
        <b-col  class="px-4 px-sm-5 py-4 mt-4" v-if="isLoadingData">
          <img src="/img/loading.svg" class="loading" alt="loading" />
        </b-col>

        <b-col class="px-4 px-sm-5 py-4 mt-4" v-else>
          <transition name="fade" mode="out-in">
            <div v-if="show" key="1">
              <b-row>
                <b-col sm="6">
                  <div class="float-sm-left p-rt-5 py-3 py-sm-0">
                    <p class="font-weight-bold mb-1 text-body text-left">Sort By</p>
                    <b-form-select
                      v-model="filterExpertReview.sortByOrderOrId"
                      :options="sortByDefaultOptions"
                      class="sortByDropdown"
                      @change="getExpertReviewData"
                    ></b-form-select>
                  </div>
                </b-col>
                <b-col sm="6" class="text-center text-sm-right">
                  <b-dropdown
                    id="dropdown-form"
                    right
                    ref="dropdown"
                    class="m-2 btn-filter"
                    no-flip
                  >
                    <template v-slot:button-content>
                      <font-awesome-icon icon="filter" class="mr-2" />FILTER
                    </template>

                    <div>
                      <p class="font-weight-bold mb-2">Status</p>
                    </div>

                    <div class="form-check mb-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value
                        id="allExpertReview"
                        :checked="checkAll"
                        @click="checkAllSelect()"
                        v-model="selectAllCb"
                      />
                      <label class="form-check-label" for="allExpertReview">All</label>
                    </div>
                    <div class="row">
                      <div class="col-sm-6">
                        <div class="form-check">
                          <input
                            class="form-check-input"
                            v-model="filterExpertReview.status"
                            type="checkbox"
                            value="1"
                            id="status1"
                            @change="checkStatusLength"
                          />
                          <label class="form-check-label" for="status1">Active</label>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="form-check mt-2 mt-sm-0">
                          <input
                            class="form-check-input"
                            v-model="filterExpertReview.status"
                            type="checkbox"
                            value="0"
                            id="status2"
                            @change="checkStatusLength"
                          />
                          <label class="form-check-label" for="status2">Inactive</label>
                        </div>
                      </div>
                    </div>
                    <div class="text-center mt-3">
                      <button
                        type="button"
                        class="btn btn-primary button"
                        @click="getDataByStatus()"
                      >Submit</button>
                    </div>
                  </b-dropdown>
                  <button
                    type="button"
                    class="btn btn-success button"
                    @click="addExpertReview"
                    v-if="id != 0"
                  >CREATE NEW</button>
                </b-col>
              </b-row>
              <div class="mt-5">
                <b-table
                  striped
                  responsive
                  hover
                  :items="expertReviewItems"
                  :fields="expertReviewFields"
                  :busy="isBusyExpertReview"
                  show-empty
                  empty-text="No matching records found"
                >
                  <template v-slot:cell(imageUrl)="data">
                    <div
                      class="stock-image"
                      v-bind:style="{ 'background-image': 'url(' + data.item.imageUrl + ')' }"
                      v-if="!data.item.isVideo"
                    ></div>
                    <div v-else class="embed-responsive embed-responsive-16by9 banner-video">
                      <video class="w-100 videos" controls>
                        <source :src="data.item.imageUrl" type="video/mp4" />
                      </video>
                    </div>
                  </template>
                  <template v-slot:cell(title)="data">
                    <p class="font-weight-bold mb-1">
                      <span v-if="data.item.title != ''">{{data.item.title}}</span>
                      <span v-else>No title</span>
                    </p>
                    <p class="mb-1">
                      By
                      <span v-if="data.item.author != ''">{{data.item.author}}</span>
                      <span v-else>-</span>
                    </p>
                    <p class="m-0">{{data.item.description}}</p>
                  </template>
                  <template v-slot:cell(enabled)="data">
                    <div v-if="data.item.enabled == true" class="text-success">Active</div>
                    <div v-else class="text-danger">Inactive</div>
                  </template>
                  <template v-slot:cell(id)="data">
                    <div class="d-flex justify-content-center">
                      <b-button
                        variant="link"
                        class="text-warning px-1 py-0"
                        @click="editExpertReview(data.item.id)"
                      >
                        <font-awesome-icon icon="pencil-alt" title="Edit" />
                      </b-button>
                      <b-button
                        variant="link"
                        class="text-danger px-1 py-0"
                        @click="deleteExpertReview(data.item.id)"
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
              <b-row>
                <b-col class="form-inline justify-content-center justify-content-md-between">
                  <b-pagination
                    v-model="filterExpertReview.pageNo"
                    :total-rows="rowsExpertReview"
                    :per-page="filterExpertReview.perPage"
                    class="m-md-0"
                    @change="paginationExpertReview"
                  ></b-pagination>
                  <b-form-select
                    @change="hanndleChangePerpageExpertReview"
                    v-model="filterExpertReview.perPage"
                    :options="pageOptions"
                  ></b-form-select>
                </b-col>
              </b-row>
            </div>

            <div v-else key="2">
              <b-row class="pl-1 my-3">
                <b-col cols="6">
                  <div class="panel d-flex align-items-md-center">
                    <b-form-checkbox
                      size="lg"
                      class="mt-0 mt-sm-3"
                      @change="useSameLanguageExpertReview"
                      v-model="expertReviewDetail.expertReview.isSameLanguage"
                    >ใช้เหมือนกันทุกภาษา</b-form-checkbox>
                  </div>
                </b-col>
                <b-col cols="6" class="text-right">
                  <b-button
                    type="button"
                    class="btn btn-language"
                    v-for="(language, index) in languageList"
                    v-bind:key="index"
                    v-bind:class="[ languageActiveExpertReview == language.id ? 'active' : '' ]"
                    @click="changeLanguageExpertReview(language.id,index)"
                    :disabled="expertReviewDetail.expertReview.isSameLanguage ? true : false "
                  >
                    <span class="text-uppercase">{{language.nation}}</span>
                  </b-button>
                </b-col>
              </b-row>

              <b-row>
                <b-col md="6">
                  <div
                    v-for="(item, index) in expertReviewDetail.expertReview.translationList"
                    v-bind:key="index"
                  >
                    <div
                      v-bind:class="[ languageActiveExpertReview == item.languageId ? '' : 'd-none' ]"
                    >
                      <InputText
                        textFloat="Title"
                        placeholder="Title"
                        type="text"
                        name="title"
                        isRequired
                        :img="imageLogoLangExpertReview"
                        v-model="item.title"
                        :isValidate="$v.expertReviewDetail.expertReview.translationList.$each.$iter[index].title.$error"
                        :v="$v.expertReviewDetail.expertReview.translationList.$each.$iter[index].title"
                      />
                    </div>
                  </div>
                </b-col>
                <b-col md="6">
                  <div
                    v-for="(item, index) in expertReviewDetail.expertReview.translationList"
                    v-bind:key="index"
                  >
                    <div
                      v-bind:class="[ languageActiveExpertReview == item.languageId ? '' : 'd-none' ]"
                    >
                      <InputText
                        textFloat="Review By"
                        placeholder="Review By"
                        type="text"
                        name="reviewby"
                        isRequired
                        :img="imageLogoLangExpertReview"
                        v-model="item.author"
                        :isValidate="$v.expertReviewDetail.expertReview.translationList.$each.$iter[index].author.$error"
                        :v="$v.expertReviewDetail.expertReview.translationList.$each.$iter[index].author"
                      />
                    </div>
                  </div>
                </b-col>
              </b-row>

              <div
                v-for="(item, index) in expertReviewDetail.expertReview.translationList"
                v-bind:key="index"
              >
                <div
                  v-bind:class="[ languageActiveExpertReview == item.languageId ? '' : 'd-none' ]"
                >
                  <InputTextArea
                    class="mb-4"
                    textFloat="Expert review"
                    placeholder="Expert review"
                    type="text"
                    name="exreview"
                    isRequired
                    :img="imageLogoLangExpertReview"
                    v-model="item.description"
                    :isValidate="$v.expertReviewDetail.expertReview.translationList.$each.$iter[index].description.$error"
                    :v="$v.expertReviewDetail.expertReview.translationList.$each.$iter[index].description"
                  />
                </div>
              </div>

              <b-row>
                <b-col md="6">
                  <UploadFile
                    textFloat="Thumbnail"
                    placeholder="Please choose file"
                    format="all"
                    name="video"
                    text="*Please upload only file .png .jpg and .mp4 size less than 50 MB"
                    isRequired
                    :fileName="expertReviewDetail.expertReview.imageUrl"
                    v-model="expertReviewDetail.expertReview.imageUrl"
                    v-on:onFileChange="onImageExpertReviewChange"
                    v-on:delete="deleteExpertReviewImage"
                    :v="$v.expertReviewDetail.expertReview.imageUrl"
                  />
                  <div class="position-relative">
                    <div
                      class="preview-box b-contain-56"
                      v-if="!expertReviewDetail.expertReview.isVideo"
                      v-bind:style="{ 'background-image': 'url('+showExpertReviewImage+')' }"
                    ></div>
                    <div
                      class="preview-box position-relative p-0 embed-responsive embed-responsive-16by9 banner-video"
                      v-else
                    >
                      <video ref="videoRef" class="w-100 video-box" controls>
                        <source :src="showExpertReviewImage" type="video/mp4" />
                      </video>
                    </div>
                    <img
                      src="/img/loading.svg"
                      class="loading"
                      alt="loading"
                      v-if="isLoadingExpertReview"
                    />
                  </div>
                </b-col>
                <b-col md="6">
                  <InputText
                    textFloat="Sort Order"
                    placeholder="Sort Order"
                    type="text"
                    name="sortorder"
                    v-model="expertReviewDetail.expertReview.sortOrder"
                    @onKeypress="isNumber($event)"
                  />
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
                      v-model="expertReviewDetail.expertReview.enabled"
                      class="radio-active"
                      size="lg"
                    >
                      <span
                        class="ml-2 main-label"
                      >{{expertReviewDetail.expertReview.enabled ? 'Active' : 'Inactive' }}</span>
                    </b-form-checkbox>
                  </div>
                </b-col>
              </b-row>

              <b-row class="mt-5">
                <b-col md="6">
                  <b-button @click="goBack" class="btn-details-set" :disabled="isDisable">BACK</b-button>
                </b-col>
                <b-col md="6" class="text-sm-right">
                  <button
                    type="button"
                    @click="checkExpertReview(0)"
                    :disabled="isDisable"
                    v-if="isEdit"
                    class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  >Save</button>
                  <button
                    type="button"
                    @click="checkExpertReview(1)"
                    :disabled="isDisable"
                    class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  >Save & Exit</button>
                </b-col>
              </b-row>
            </div>
          </transition>

          <b-row class="mt-5" v-if="show">
            <b-col md="6">
              <b-button href="/product" class="btn-details-set">CANCEL</b-button>
            </b-col>
          </b-row>
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
import InputTextArea from "@/components/inputs/InputTextArea";
import { required } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";
import UploadFile from "@/components/inputs/UploadFile";

export default {
  name: "ProductExpertReview",
  components: {
    InputText,
    ModalAlert,
    InputTextArea,
    UploadFile
  },
  data() {
    return {
      id: this.$route.params.id,
      isDisable: false,
      isEdit: false,
      isLoadingData: false,
      error: false,
      show: true,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      checkAll: false,
      selectAllCb: false,
      expertReviewItems: [],
      languageList: [],
      imageLogoLangExpertReview: "",
      showExpertReviewImage: "",
      languageActive: 1,
      languageActiveExpertReview: 1,
      isLoadingExpertReview: false,
      isBusyExpertReview: false,
      isSameLanguageExpertReview: false,
      isExpertReview: false,
      rowsExpertReview: 0,
      expertReviewFields: [
        {
          key: "imageUrl",
          label: "Thumbnail",
          class: "w-200"
        },
        {
          key: "title",
          label: "Details",
          tdClass: "text-left",
          class: "w-200"
        },
        {
          key: "sortOrder",
          label: "Sort Order",
          class: "w-100px"
        },
        {
          key: "enabled",
          label: "Status",
          class: "w-100px"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      filterExpertReview: {
        perPage: 10,
        pageNo: 1,
        sortByOrderOrId: 0,
        status: []
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ],
      sortByDefaultOptions: [
        { value: 0, text: "Please select an option" },
        { value: 1, text: "Sort Order" },
        { value: 2, text: "Created Time" }
      ],
      expertReviewDetail: {
        expertReview: {
          id: 0,
          productId: 0,
          sortOrder: 0,
          isVideo: false,
          imageUrl: "",
          coverImageUrl: "",
          enabled: false,
          mainLanguageId: 0,
          isSameLanguage: false,
          translationList: [
            {
              languageId: 1,
              author: null,
              title: null,
              description: null
            },
            {
              languageId: 2,
              author: null,
              title: null,
              description: null
            }
          ]
        }
      }
    };
  },
  validations: {
    expertReviewDetail: {
      expertReview: {
        imageUrl: { required },
        translationList: {
          $each: {
            author: { required },
            title: { required },
            description: { required }
          }
        }
      }
    }
  },
  created: async function() {
    if (this.id != 0) {
      await this.getExpertReviewData();
    }
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
    getExpertReviewData: async function() {
      let languages = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/language`,
        null,
        this.$headers,
        null
      );
      if (languages.result == 1) {
        this.languageList = languages.detail;
        this.changeLanguageExpertReview(1, 0);
      }

      this.isBusyExpertReview = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/expertReviewList/${this.id}`,
        null,
        this.$headers,
        this.filterExpertReview
      );

      if (data.result == 1) {
        this.expertReviewItems = data.detail.dataList;
        this.rowsExpertReview = data.detail.count;
        this.isBusyExpertReview = false;
      }
    },
    paginationExpertReview(Page) {
      this.filterExpertReview.pageNo = Page;
      this.getExpertReviewData();
    },
    hanndleChangePerpageExpertReview(value) {
      this.filterExpertReview.pageNo = 1;
      this.filterExpertReview.perPage = value;
      this.getExpertReviewData();
    },
    handleCloseModal: async function() {
      if (this.flagStock == 1) {
        window.location.href = "/product";
      } else {
        if (this.expertReviewDetail.expertReview.id > 0) {
          this.getExpertReviewDataDetails(
            this.expertReviewDetail.expertReview.id
          );
        } else {
          this.show = true;
          this.getExpertReviewData();
        }
      }
    },
    checkStatusLength() {
      if (this.filterExpertReview.status.length == 2) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
    },
    checkAllSelect() {
      if (this.selectAllCb) {
        this.filterExpertReview.status = [];
      } else {
        this.filterExpertReview.status = [1, 0];
      }
    },
    getDataByStatus() {
      this.$refs.dropdown.hide(true);
      this.getExpertReviewData();
    },
    addExpertReview() {
      if (this.id == 0) {
        this.$refs["modalFail"].show();
        return;
      }

      this.show = !this.show;
      this.isEdit = false;
      this.getExpertReviewDataDetails(0);
      this.$v.expertReviewDetail.$reset();
    },
    editExpertReview(id) {
      this.show = !this.show;
      this.isEdit = true;
      this.getExpertReviewDataDetails(id);
    },
    deleteExpertReview: async function(id) {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/product/removeExpertReview/${id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          this.getExpertReviewData();
        }
      }
    },
    getExpertReviewDataDetails: async function(id) {
      this.isLoadingData = true;

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/expertReview/${id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.expertReviewDetail = data.detail;
        this.isLoadingData = false;
        this.$v.expertReviewDetail.$reset();

        if (id > 0) {
          this.showExpertReviewImage = data.detail.expertReview.imageUrl;
        }
        this.changeLanguageExpertReview(1, 0);
      }
    },
    checkValidateTranslationListExpertReview() {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (
            this.$v.expertReviewDetail.expertReview.translationList.$each.$iter[
              index
            ].$error
          ) {
            this.languageActiveExpertReview = this.$v.expertReviewDetail.expertReview.translationList.$model[
              index
            ].languageId;

            this.imageLogoLangExpertReview = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    checkExpertReview: async function(flag) {
      this.modalAlertShow = false;
      this.flagStock = flag;
      this.isExpertReview = false;

      if (this.expertReviewDetail.expertReview.isSameLanguage) {
        await this.useSameLanguageExpertReview();
      }

      this.$v.expertReviewDetail.$touch();
      if (this.$v.expertReviewDetail.$error) {
        await this.checkValidateTranslationListExpertReview();
        return;
      }

      this.saveExpertReview();
    },
    saveExpertReview: async function() {
      this.isDisable = true;
      this.isExpertReview = true;
      this.expertReviewDetail.expertReview.productId = this.id;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveExpertReview`,
        null,
        this.$headers,
        this.expertReviewDetail
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
    onImageExpertReviewChange(img) {
      this.isLoadingExpertReview = true;
      this.isDisable = true;

      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = async () => {
        this.images = await this.saveImagetoDb(reader.result);
        this.isLoadingExpertReview = false;
        this.isDisable = false;
        if (img.type == "video/mp4") {
          this.expertReviewDetail.expertReview.isVideo = true;
        } else {
          this.expertReviewDetail.expertReview.isVideo = false;
        }
        this.showExpertReviewImage = this.images;
        this.expertReviewDetail.expertReview.imageUrl = this.images;
      };
    },
    saveImagetoDb: async function(img) {
      var imgData = {
        base64: img
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveImage`,
        null,
        this.$headers,
        imgData
      );

      if (data.result == 1) {
        return data.detail.url;
      }
    },
    deleteExpertReviewImage(value) {
      this.expertReviewDetail.expertReview.imageUrl = null;
      this.showExpertReviewImage = null;
    },
    useSameLanguageExpertReview: async function() {
      Vue.nextTick(() => {
        if (this.expertReviewDetail.expertReview.isSameLanguage) {
          this.expertReviewDetail.expertReview.mainLanguageId = this.languageActiveExpertReview;
          let data = this.expertReviewDetail.expertReview.translationList.filter(
            val => val.languageId == this.languageActiveExpertReview
          );

          //if (this.thumbnailmodal.productImageId == 0) {
          if (data.length == 1) {
            data = data[0];
            for (
              let index = 0;
              index <
              this.expertReviewDetail.expertReview.translationList.length;
              index++
            ) {
              this.expertReviewDetail.expertReview.translationList[
                index
              ].author = data.author;
              this.expertReviewDetail.expertReview.translationList[
                index
              ].title = data.title;
              this.expertReviewDetail.expertReview.translationList[
                index
              ].description = data.description;
            }
          }
          //}
        } else {
          let data = this.expertReviewDetail.expertReview.translationList.filter(
            val => val.languageId != this.languageActiveExpertReview
          );
          if (this.expertReviewDetail.expertReview.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.author = "";
              data.title = "";
              data.description = "";
            }
          }
        }
      });
    },
    changeLanguageExpertReview(id, index) {
      this.languageActiveExpertReview = id;
      this.imageLogoLangExpertReview = this.languageList[index].imageUrl;
    },
    goBack() {
      this.show = true;
      this.getExpertReviewData();
    }
  }
};
</script>

<style scoped>
.stock-image {
  padding-bottom: 56.25%;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}
</style>