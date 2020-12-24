<template>
  <div>
    <form class="form-box">
      <b-row class="no-gutters bg-white-border">
        <b-col class="px-4 px-sm-5 py-4 vh-100" v-if="isLoadingData">
          <img src="/img/loading.svg" class="loading" alt="loading" />
        </b-col>

        <b-col class="px-4 px-sm-5 py-4" v-else>
          <b-row class="mt-4">
            <b-col md="6">
              <UploadFile
                textFloat="Product Image"
                placeholder="Please choose file"
                format="image"
                name="thumbnail"
                text="*Please upload only file .png, .jpg less than 10 MB"
                :fileName="thumbnails.thumbnail.imageUrl"
                v-model="thumbnails.thumbnail.imageUrl"
                v-on:onFileChange="onImageChange"
                v-on:delete="deleteImage"
                :v="$v.thumbnails.thumbnail.imageUrl"
                isRequired
              />
              <div
                class="preview-box b-contain"
                v-bind:style="{ 'background-image': 'url('+showProductImage+')' }"
              >
                <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoading" />
              </div>
            </b-col>
            <b-col md="6">
              <UploadFile
                textFloat="Product Image (Hover)"
                placeholder="Please choose file"
                format="image"
                name="thumbnailhover"
                text="*Please upload only file .png, .jpg less than 10 MB"
                :fileName="thumbnails.thumbnail.hoverImageUrl"
                v-model="thumbnails.thumbnail.hoverImageUrl"
                v-on:onFileChange="onImageHoverChange"
                v-on:delete="deleteImageHover"
                :v="$v.thumbnails.thumbnail.hoverImageUrl"
              />
              <div
                class="preview-box b-contain"
                v-bind:style="{ 'background-image': 'url('+showProductImageHover+')' }"
              >
                <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoadingHover" />
              </div>
            </b-col>
          </b-row>

          <HeaderLine text="Gallary" class="my-4" v-if="id != 0" />

          <div class="text-right">
            <b-button class="btn-main mb-3" @click="addGallery" v-if="id != 0">Create New</b-button>
          </div>

          <div>
            <b-table
              striped
              responsive
              hover
              :items="thumbnails.productImage"
              :fields="thunbnailFields"
              :busy="isBusy"
              show-empty
              empty-text="No matching records found"
            >
              <template v-slot:cell(imageUrl)="data">
                <div
                  class="square-box b-contain-square"
                  v-bind:style="{ 'background-image': 'url(' + data.item.imageUrl + ')' }"
                ></div>
              </template>
              <template v-slot:cell(sortOrder)="data">
                <b-form-input v-model="data.item.sortOrder" class="sortorder" />
              </template>
              <template v-slot:cell(productImageId)="data">
                <div class="d-flex justify-content-center">
                  <b-button
                    variant="link"
                    class="text-warning px-1 py-0"
                    @click="editGallery(data.index,data.item.productImageId)"
                  >
                    <font-awesome-icon icon="pencil-alt" title="Edit" />
                  </b-button>
                  <b-button
                    variant="link"
                    class="text-danger px-1 py-0"
                    @click="deleteGallery(data.item.productImageId)"
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
          <b-row class="mt-5">
            <b-col md="6">
              <b-button href="/product" class="btn-details-set" :disabled="isDisable">CANCEL</b-button>
            </b-col>
            <b-col md="6" class="text-sm-right">
              <button
                type="button"
                class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                :disabled="isDisable"
                @click="checkThumbnail(0)"
              >Save</button>
              <button
                type="button"
                :disabled="isDisable"
                @click="checkThumbnail(1)"
                class="btn btn-success btn-details-set ml-md-2 text-uppercase"
              >Save & Exit</button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </form>
    <b-modal
      id="addThumbnail"
      ref="addThumbnail"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 p-0">
        <h3 class="font-weight-bold">
          <span v-if="isAdd">Add</span>
          <span v-else>Edit</span>
          Gallery
        </h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('addThumbnail')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <b-row class="pl-1 my-3">
                <b-col cols="6">
                  <div class="panel d-flex align-items-md-center">
                    <b-form-checkbox
                      size="lg"
                      id="sameLangs"
                      v-model="isSameLanguageModal"
                      class="mt-0 mt-sm-3"
                      @change="useSameLanguageModal"
                    >ใช้เหมือนกันทุกภาษา</b-form-checkbox>
                  </div>
                </b-col>
                <b-col cols="6" class="text-right">
                  <b-button
                    type="button"
                    class="btn btn-language"
                    v-for="(language, index) in languageList"
                    v-bind:key="index"
                    v-bind:class="[ languageActiveModal == language.id ? 'active' : '' ]"
                    @click="changeLanguageModal(language.id,index)"
                    :disabled="isSameLanguageModal ? true : false "
                  >
                    <span class="text-uppercase">{{language.nation}}</span>
                  </b-button>
                </b-col>
              </b-row>

              <div>
                <UploadFile
                  textFloat="Thumbnail"
                  placeholder="Please choose file"
                  format="image"
                  name="thumbnail"
                  text="*Please upload only file .png, .jpg size 1100 x 1100 px and less than 10 MB"
                  isRequired
                  :isValidate="$v.thumbnailmodal.imageUrl.$error"
                  :v="$v.thumbnailmodal.imageUrl"
                  :fileName="thumbnailmodal.imageUrl"
                  v-model="thumbnailmodal.imageUrl"
                  v-on:onFileChange="onImageModalChange"
                  v-on:delete="deleteImageModal"
                />
                <div
                  class="preview-box b-contain"
                  v-bind:style="{ 'background-image': 'url('+showProductImageModal+')' }"
                >
                  <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoadingModal" />
                </div>
              </div>

              <div v-for="(items, index) in thumbnailmodal.translation" v-bind:key="index">
                <div v-bind:class="[ languageActiveModal == items.languageId ? '' : 'd-none' ]">
                  <b-row>
                    <b-col>
                      <InputText
                        class="mb-4"
                        textFloat="Alt Tag"
                        placeholder="Alt Tag"
                        type="text"
                        name="alttag"
                        v-model="items.altTag"
                        :img="imageLogoLangModal"
                      />
                    </b-col>
                  </b-row>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-3">
        <b-button class="btn btn-main" :disabled="isDisable" @click="saveThumbnailModal">Save</b-button>
      </div>
    </b-modal>

    <ModalAlert
      v-if="modalAlertShow"
      :msg="msgModal"
      :img="imgModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
    />

    <b-modal
      id="modalFail"
      ref="modalFail"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <button type="button" aria-label="Close" class="close" @click="$bvModal.hide('modalFail')">×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <div class="text-center">
                <img src="/img/icon-unsuccess.png" alt="fail" class="mb-3" />
                <h1 class="text-msg mt-3 font-weight-bold">Please create product before proceeding</h1>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import { required } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";
import UploadFile from "@/components/inputs/UploadFile";
import HeaderLine from "@/components/HeaderLine";
import VueCookies from "vue-cookies";

export default {
  name: "ProductThumbnail",
  components: {
    ModalAlert,
    UploadFile,
    HeaderLine,
    InputText
  },
  data() {
    return {
      id: this.$route.params.id,
      languageList: [],
      items: [],
      isBusy: false,
      isLoadingData: false,
      imageLogoLangModal: "",
      languageActive: 1,
      isDisable: false,
      images: "",
      existId: "",
      isAdd: false,
      isEdit: false,
      showProductImage: "",
      showProductImageHover: "",
      showProductImageModal: "",
      isLoading: false,
      isLoadingHover: false,
      isLoadingModal: false,
      isSameLanguageModal: true,
      languageActiveModal: 1,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      modalData: [],
      isSuccess: false,
      thumbnails: {
        thumbnail: {
          productId: 0,
          imageUrl: "",
          hoverImageUrl: ""
        },
        productImage: [],
        productImageRemove: []
      },
      thumbnailmodal: {
        productImageId: 0,
        imageUrl: "",
        sortOrder: 1,
        translation: [
          {
            languageId: 1,
            altTag: ""
          },
          {
            languageId: 2,
            altTag: ""
          }
        ]
      },
      thunbnailFields: [
        {
          key: "imageUrl",
          label: "Thumbnail",
          class: "w-100px"
        },
        {
          key: "translation[0].altTag",
          label: "Alt Tag"
        },
        {
          key: "sortOrder",
          label: "Sort order"
        },
        {
          key: "productImageId",
          label: "Action"
        }
      ]
    };
  },
  validations: {
    thumbnails: {
      thumbnail: {
        imageUrl: { required }
      }
    },
    thumbnailmodal: {
      imageUrl: { required }
    }
  },
  created: async function() {
    setTimeout(async () => {
      if (this.id != 0) {
        this.isLoadingData = true;
        await this.getThumbnailData();
      }
    }, 3000);
  },
  methods: {
    handleCloseModal: async function() {
      if (this.flag == 1) {
        window.location.href = "/product";
      } else {
        if (this.id > 0) {
          this.isLoadingData = true;
          this.getThumbnailData();
        } else {
          this.id = this.existId;
          if (this.$route.params.id != 0) this.getThumbnailData();
        }
      }
    },
    getThumbnailData: async function() {
      this.languageList = this.$languages;

      let thumbnailData = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/thumbnail/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (thumbnailData.result == 1) {
        this.changeLanguageModal(1, 0);
        this.thumbnails = thumbnailData.detail;
        this.showProductImage = this.thumbnails.thumbnail.imageUrl;
        this.showProductImageHover = this.thumbnails.thumbnail.hoverImageUrl;
        this.isLoadingData = false;
        this.$v.thumbnails.$reset();
      }
    },
    checkThumbnail: async function(flag) {
      this.modalAlertShow = false;
      this.flag = flag;

      if (this.$route.params.id == 0) {
        if (this.id == 0) {
          this.$refs["modalFail"].show();
          return;
        }
      }

      this.$v.thumbnails.$touch();
      if (this.$v.thumbnails.$error) {
        return;
      }

      this.saveThumbnail();
    },
    saveThumbnail: async function() {
      this.isDisable = true;

      if (this.$route.params.id != 0)
        this.thumbnails.thumbnail.productId = this.$route.params.id;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveThumbnail`,
        null,
        this.$headers,
        this.thumbnails
      );

      this.modalAlertShow = true;
      if (data.result == 1) {
        this.imgModal = "/img/icon-check-green.png";
        this.msgModal = data.message;
        this.isSuccess = true;
        this.existId = this.$route.params.id;
      } else {
        this.imgModal = "/img/icon-unsuccess.png";
        this.msgModal = data.detail[0];
        this.isSuccess = false;
      }

      this.isDisable = false;
    },
    onImageChange: async function(img) {
      this.isLoading = true;
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = async () => {
        this.images = await this.saveImagetoDb(reader.result);
        this.isLoading = false;

        if (this.thumbnails.thumbnail.imageUrl == "") {
          let imageData = {
            productImageId: 0,
            imageUrl: this.images,
            sortOrder: 1,
            translation: [
              {
                languageId: 1,
                altTag: VueCookies.get("product_name_th")
              },
              {
                languageId: 2,
                altTag: VueCookies.get("product_name_en")
              }
            ]
          };

          this.thumbnails.productImage.push(imageData);
        }

        this.showProductImage = this.images;
        this.thumbnails.thumbnail.imageUrl = this.images;
      };
    },
    onImageHoverChange(img) {
      this.isLoadingHover = true;
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = async () => {
        this.images = await this.saveImagetoDb(reader.result);
        this.isLoadingHover = false;

        if (this.thumbnails.thumbnail.hoverImageUrl == "") {
          let imageData = {
            productImageId: 0,
            imageUrl: this.images,
            sortOrder: 1,
            translation: [
              {
                languageId: 1,
                altTag: VueCookies.get("product_name_th")
              },
              {
                languageId: 2,
                altTag: VueCookies.get("product_name_en")
              }
            ]
          };

          this.thumbnails.productImage.push(imageData);
        }

        this.showProductImageHover = this.images;
        this.thumbnails.thumbnail.hoverImageUrl = this.images;
      };
    },
    onImageModalChange(img) {
      this.isLoadingModal = true;
      this.isDisable = true;
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = async () => {
        this.images = await this.saveImagetoDb(reader.result);
        this.isLoadingModal = false;
        this.isDisable = false;
        this.showProductImageModal = this.images;
        this.thumbnailmodal.imageUrl = this.images;
      };
    },
    deleteImage(value) {
      this.thumbnails.thumbnail.imageUrl = null;
      this.thumbnails.thumbnail.imageBase64 = null;
      this.showProductImage = null;
    },
    deleteImageHover(value) {
      this.thumbnails.thumbnail.hoverImageUrl = null;
      this.thumbnails.thumbnail.hoverImageBase64 = null;
      this.showProductImageHover = null;
    },
    deleteImageModal(value) {
      this.thumbnailmodal.imageUrl = null;
      this.thumbnailmodal.imageBase64 = null;
      this.showProductImageModal = null;
    },
    addGallery() {
      this.clearModal();
      this.isAdd = true;
      this.isSameLanguageModal = true;
      this.imageLogoLangModal = "";
      this.$v.thumbnailmodal.$reset();
      this.$refs["addThumbnail"].show();
    },
    editGallery(index, id) {
      this.modalData = this.thumbnails.productImage[index];

      this.productid = id;
      this.thumbnailmodal.productImageId = id;
      this.thumbnailmodal.imageUrl = this.modalData.imageUrl;
      this.showProductImageModal = this.modalData.imageUrl;
      this.thumbnailmodal.sortOrder = this.modalData.sortOrder;
      this.thumbnailmodal.translation[0].altTag = this.modalData.translation[0].altTag;
      this.thumbnailmodal.translation[1].altTag = this.modalData.translation[1].altTag;
      this.languageActiveModal = 1;
      this.isAdd = false;

      if (
        this.modalData.translation[0].altTag ==
        this.modalData.translation[1].altTag
      ) {
        this.isSameLanguageModal = true;
      } else {
        this.isSameLanguageModal = false;
      }

      if (this.isSameLanguageModal) {
        this.imageLogoLangModal = "";
      } else {
        var index = this.languageList
          .map(function(x) {
            return x.id;
          })
          .indexOf(this.languageActiveModal);
        this.imageLogoLangModal = this.languageList[index].imageUrl;
      }

      this.$refs["addThumbnail"].show();
    },
    useSameLanguageModal: async function() {
      Vue.nextTick(() => {
        if (this.isSameLanguageModal) {
          this.imageLogoLangModal = "";
          let data = this.thumbnailmodal.translation.filter(
            val => val.languageId == this.languageActiveModal
          );

          //if (this.thumbnailmodal.productImageId == 0) {
          if (data.length == 1) {
            data = data[0];
            for (
              let index = 0;
              index < this.thumbnailmodal.translation.length;
              index++
            ) {
              this.thumbnailmodal.translation[index].altTag = data.altTag;
            }
          }
          //}
        } else {
          var index = this.languageList
            .map(function(x) {
              return x.id;
            })
            .indexOf(this.languageActive);
          this.imageLogoLangModal = this.languageList[index].imageUrl;

          let data = this.thumbnailmodal.translation.filter(
            val => val.languageId != this.languageActiveModal
          );
          if (this.isAdd) {
            if (data.length == 1) {
              data = data[0];
              data.altTag = "";
            }
          }
        }
      });
    },
    changeLanguageModal(id, index) {
      this.languageActiveModal = id;
      this.imageLogoLangModal = this.languageList[index].imageUrl;
    },
    saveThumbnailModal: async function() {
      if (this.isSameLanguageModal) {
        await this.useSameLanguageModal();
      }

      this.$v.thumbnailmodal.$touch();
      if (this.$v.thumbnailmodal.$error) {
        return;
      }

      if (this.isAdd) {
        let currentModalData = {
          productImageId: 0,
          imageUrl: this.thumbnailmodal.imageUrl,
          sortOrder: this.thumbnailmodal.sortOrder,
          translation: [
            {
              languageId: 1,
              altTag: this.thumbnailmodal.translation[0].altTag
            },
            {
              languageId: 2,
              altTag: this.thumbnailmodal.translation[1].altTag
            }
          ]
        };
        this.thumbnails.productImage.push(currentModalData);
      } else {
        this.modalData.productImageId = this.thumbnailmodal.productImageId;
        this.modalData.imageUrl = this.thumbnailmodal.imageUrl;
        this.modalData.sortOrder = this.thumbnailmodal.sortOrder;
        this.modalData.translation[0].altTag = this.thumbnailmodal.translation[0].altTag;
        this.modalData.translation[1].altTag = this.thumbnailmodal.translation[1].altTag;
      }

      await this.$refs["addThumbnail"].hide();
    },
    clearModal() {
      this.productid = 0;
      this.thumbnailmodal.productImageId = 0;
      this.thumbnailmodal.imageUrl = "";
      this.showProductImageModal = "";
      this.thumbnailmodal.sortOrder = 1;
      this.thumbnailmodal.translation[0].altTag = "";
      this.thumbnailmodal.translation[1].altTag = "";
      this.isSameLanguageModal = false;
      this.languageActiveModal = 1;
    },
    checkValidateTranslationListOnModal() {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (this.$v.thumbnailmodal.translation.$each.$iter[index].$error) {
            this.languageActiveModal = this.$v.thumbnailmodal.translation.$model[
              index
            ].languageId;

            this.imageLogoLangModal = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
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
    deleteGallery(id) {
      if (id != 0) {
        this.thumbnails.productImageRemove.push(id);
      }

      let array = [];
      let index = "";

      array = this.thumbnails.productImage;

      for (var i = 0; i < array.length; i++) {
        if (array[i].productImageId == id) {
          array.splice(i, 1);
          break;
        }
      }
    }
  }
};
</script>

<style scoped>
.sortorder {
  background: transparent;
  border: 0px solid #d8dbe0;
  text-align: center;
  width: 100px;
  margin: auto;
}
.sortorder:focus {
  border: 1px solid #958bef;
}
.b-contain {
  background-size: contain;
  padding-bottom: 50%;
}
.b-contain-square {
  background-size: contain;
  padding-top: 50%;
}
</style>