<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Skin Consultation Details</h1>
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
                    v-model="form.skinConsult.isSameLanguage"
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
                  :disabled="form.skinConsult.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <div v-for="(item, index) in form.skinConsult.translationList" v-bind:key="index">
              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <InputText
                  textFloat="Skin Problem"
                  placeholder="Skin Problem"
                  type="text"
                  name="skinproblem"
                  isRequired
                  v-model="item.name"
                  :img="imageLogoLang"
                  :isValidate="$v.form.skinConsult.translationList.$each.$iter[index].name.$error"
                  :v="$v.form.skinConsult.translationList.$each.$iter[index].name"
                  @onKeyup="setAlttag(item.name,index)"
                />
              </div>

              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <InputTextArea
                  class="mb-4"
                  textFloat="Cause"
                  placeholder="Cause"
                  type="text"
                  name="cause"
                  rows="5"
                  isRequired
                  v-model="item.causes"
                  :img="imageLogoLang"
                  :isValidate="$v.form.skinConsult.translationList.$each.$iter[index].causes.$error"
                  :v="$v.form.skinConsult.translationList.$each.$iter[index].causes"
                />
              </div>

              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <InputTextArea
                  class="mb-4"
                  textFloat="Solution"
                  placeholder="Solution"
                  type="text"
                  name="solution"
                  rows="5"
                  isRequired
                  v-model="item.solutions"
                  :img="imageLogoLang"
                  :isValidate="$v.form.skinConsult.translationList.$each.$iter[index].solutions.$error"
                  :v="$v.form.skinConsult.translationList.$each.$iter[index].solutions"
                />
              </div>
            </div>

            <b-row>
              <b-col md="6">
                <UploadFile
                  textFloat="Thumbnail"
                  placeholder="Please choose file"
                  format="image"
                  name="thumbnail"
                  text="*Please upload only file .png, .jpg size 100 x 100 px and less than 10 MB"
                  isRequired
                  :fileName="form.skinConsult.imageUrl"
                  v-model="form.skinConsult.imageUrl"
                  v-on:onFileChange="onImageChange"
                  v-on:delete="deleteImage"
                  :v="$v.form.skinConsult.imageUrl"
                />

                <div
                  class="preview-box shipping-img"
                  v-bind:style="{ 'background-image': 'url('+showPreview+')' }"
                >
                  <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoading" />
                </div>
              </b-col>
              <b-col md="6">
                <div v-for="(item, index) in form.skinConsult.translationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <InputText
                      textFloat="Alt Tag"
                      placeholder="Alt Tag"
                      type="text"
                      name="alttag"
                      isRequired
                      v-model="item.altTag"
                      :img="imageLogoLang"
                      :isValidate="$v.form.skinConsult.translationList.$each.$iter[index].altTag.$error"
                      :v="$v.form.skinConsult.translationList.$each.$iter[index].altTag"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Sort Order"
                  placeholder="Sort Order"
                  type="text"
                  name="sortorder"
                  v-model="form.skinConsult.sortOrder"
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
                    v-model="form.skinConsult.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span
                      class="ml-2 main-label"
                    >{{form.skinConsult.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <HeaderLine text="Product Suggesstion" class="my-4" />

            <div class="mt-3 mt-sm-5">
              <b-row>
                <b-col md="6">
                  <b-input-group class="panel-input-serach">
                    <b-form-input
                      class="input-serach"
                      placeholder="Name"
                      @keyup="handleSearch"
                      v-model="productlistfilter.search"
                    ></b-form-input>
                    <b-input-group-prepend>
                      <span class="icon-input m-auto pr-2">
                        <font-awesome-icon icon="search" />
                      </span>
                    </b-input-group-prepend>
                  </b-input-group>
                </b-col>
                <b-col md="6" class="text-sm-right">
                  <b-form-checkbox
                    size="lg"
                    class="mt-3"
                    v-model="isProductInSkinConsults"
                    @change="getProductList"
                  >Show only product in this category</b-form-checkbox>
                </b-col>
              </b-row>

              <b-table
                responsive
                striped
                :fields="productlistfields"
                :items="productlistitems"
                :busy="isBusy"
                show-empty
                empty-text="No matching records found"
                class="mt-3"
              >
                <template v-slot:cell(ids)="data">
                  <b-form-checkbox
                    size="lg"
                    class="ml-3"
                    :value="data.item.id"
                    v-model="form.productId"
                  ></b-form-checkbox>
                </template>
                <template v-slot:cell(imageUrl)="data">
                  <div class="position-relative">
                    <div
                      class="square-box"
                      v-bind:style="{ 'background-image': 'url(' + data.item.imageUrl + ')' }"
                    ></div>
                  </div>
                </template>
                <template v-slot:cell(name)="data">
                  <div class>
                    <div class>
                      <div class="tag-box tb-new" v-if="data.item.isNew">New</div>
                      <div class="tag-box tb-hot" v-if="data.item.isHot">Hot</div>
                    </div>

                    <router-link :to="'/product/details/'+data.item.id">
                      <span class="mb-0 nobreak two-lines">{{data.item.name}}</span>
                    </router-link>
                  </div>
                </template>
                <template v-slot:cell(price)="data">
                  <p
                    class="m-0"
                    v-if="data.item.advancePrice > 0"
                    style=" text-decoration: line-through"
                  >{{data.item.price | numeral('0,0.00')}}</p>
                  <p
                    class="m-0"
                    v-if="data.item.advancePrice == 0"
                  >{{data.item.price | numeral('0,0.00')}}</p>
                  <p class="m-0 text-danger" v-else>{{data.item.advancePrice | numeral('0,0.00')}}</p>
                </template>
                <template v-slot:cell(id)="data">
                  <div class="d-flex justify-content-center">
                    <b-button
                      variant="link"
                      class="text-danger px-1 py-0"
                      @click="deleteProduct(data.item.id,1)"
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

              <p
                v-if="$v.form.productId.$error"
                class="text-danger"
              >Please select at least one product</p>
            </div>
            <b-row>
              <b-col class="form-inline justify-content-center justify-content-md-between">
                <b-pagination
                  v-model="productlistfilter.pageNo"
                  :total-rows="productlistrows"
                  :per-page="productlistfilter.perPage"
                  class="m-md-0"
                  @change="pagination"
                ></b-pagination>
                <b-form-select
                  v-model="productlistfilter.perPage"
                  @change="hanndleChangePerpage"
                  :options="pageOptions"
                ></b-form-select>
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
                <b-button
                  href="/skinconsultation"
                  :disabled="isDisable"
                  class="btn-details-set"
                >CANCEL</b-button>
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
    <b-modal
      id="addProductModal"
      ref="addProductModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      size="lg"
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Product List</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('addProductModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <b-table
                responsive
                striped
                :fields="productfields"
                :items="productitems"
                :busy="isBusys"
                show-empty
                empty-text="No matching records found"
                class="mt-4"
              >
                <template v-slot:cell(id)="data">
                  <b-form-checkbox size="lg" class="ml-3" :value="data.item.id" v-model="selected"></b-form-checkbox>
                </template>
                <template v-slot:cell(imageUrl)="data">
                  <div class="position-relative">
                    <div
                      class="square-box"
                      v-bind:style="{ 'background-image': 'url(' + data.item.imageUrl + ')' }"
                    ></div>
                  </div>
                </template>
                <template v-slot:cell(name)="data">
                  <div class>
                    <div class>
                      <div class="tag-box tb-new" v-if="data.item.isNew">New</div>
                      <div class="tag-box tb-hot" v-if="data.item.isHot">Hot</div>
                    </div>

                    <router-link :to="'/product/details/'+data.item.id">
                      <span class="mb-0 nobreak two-lines">{{data.item.name}}</span>
                    </router-link>
                  </div>
                </template>
                <template v-slot:cell(price)="data">
                  <div>
                    <p class="m-0">{{ data.item.price | numeral('0,0.00') }}</p>
                  </div>
                </template>
                <template v-slot:table-busy>
                  <div class="text-center text-black my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong class="ml-2">Loading...</strong>
                  </div>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="form-inline justify-content-center justify-content-md-between">
              <b-pagination
                v-model="productfilter.pageNo"
                :total-rows="productrows"
                :per-page="productfilter.perPage"
                class="m-md-0"
                @change="paginationProduct"
              ></b-pagination>
              <b-form-select
                v-model="productfilter.perPage"
                @change="hanndleChangePerpageProduct"
                :options="pageOptions"
              ></b-form-select>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-3">
        <b-button class="btn btn-main" :disabled="isDisable" @click="addProductToTable">Submit</b-button>
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
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";
import UploadFile from "@/components/inputs/UploadFile";
import { required, requiredIf } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";
import HeaderLine from "@/components/HeaderLine";

export default {
  name: "SkinConsultDetails",
  components: {
    InputText,
    InputTextArea,
    UploadFile,
    ModalAlert,
    HeaderLine
  },
  data() {
    return {
      languageList: [],
      productlistitems: [],
      productitems: [],
      existId: "",
      isProductInSkinConsults: true,
      isLoadingData: false,
      pageOptions: [
        { value: 5, text: "5 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ],
      productlistfilter: {
        perPage: 5,
        pageNo: 1,
        search: "",
        isProductInSkinConsult: false,
        productIdList: []
      },
      productfilter: {
        search: "",
        pageNo: 1,
        perPage: 5
      },
      imageLogoLang: "",
      showPreview: "",
      languageActive: 1,
      productlistrows: 0,
      productrows: 0,
      addProductType: 0,
      isEdit: false,
      isLoading: false,
      isBusy: false,
      isBusys: false,
      isDisable: false,
      imgModal: null,
      msgModal: null,
      selected: [],
      id: this.$route.params.id,
      modalAlertShow: false,
      productlistfields: [
        {
          key: "ids",
          label: "",
        },
        {
          key: "imageUrl",
          label: "Thumbnail",
          class: "w-50px"
        },
        {
          key: "name",
          label: "Product Name",
          class: "w-200",
          tdClass: "text-left"
        },
        {
          key: "price",
          label: "Price",
          class: "text-right"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      productfields: [
        {
          key: "id",
          label: ""
        },
        {
          key: "imageUrl",
          label: "Thumbnail",
          class: "w-100px"
        },
        {
          key: "name",
          label: "Product Name",
          class: "w-100px"
        },
        {
          key: "price",
          label: "Price",
          class: "w-100px"
        }
      ],
      form: {
        skinConsult: {
          id: 0,
          imageUrl: "",
          enabled: false,
          sortOrder: 0,
          mainLanguageId: 0,
          isSameLanguage: false,
          translationList: [
            {
              languageId: 1,
              altTag: null,
              name: null,
              causes: null,
              solutions: null
            },
            {
              languageId: 2,
              altTag: null,
              name: null,
              causes: null,
              solutions: null
            }
          ]
        },
        productId: []
      }
    };
  },
  validations: {
    form: {
      skinConsult: {
        imageUrl: { required },
        translationList: {
          $each: {
            name: { required },
            causes: { required },
            solutions: { required },
            altTag: { required }
          }
        }
      },
      productId: {
        required: requiredIf(function() {
          return this.form.productId != [];
        })
      }
    }
  },
  created: async function() {
    await this.getDatas();
    await this.getProductList();
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
        window.location.href = "/skinconsultation";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          this.form.skinConsult.id = this.existId;
          this.id = this.existId;
          this.isEdit = true;
          this.$router.push({
            path: `/skinconsultation/details/${this.existId}`
          });
        }
      }
    },
    setAlttag: function(name, index) {
      this.form.skinConsult.translationList[index].altTag = name.replace(
        / /g,
        "-"
      );
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
        `${this.$baseUrl}/api/skinConsult/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.id > 0) {
          this.isEdit = true;
          this.showPreview = this.form.skinConsult.imageUrl;
        }

        if (this.form.skinConsult.isSameLanguage) {
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
    getProductList: async function() {
      this.isBusy = true;

      Vue.nextTick(() => {
        if (this.isProductInSkinConsults == true) {
          this.productlistfilter.isProductInSkinConsult = true;
        } else {
          this.productlistfilter.isProductInSkinConsult = false;
        }
      });

      this.productlistfilter.productIdList = [];

      await this.form.productId.forEach((element, index) => {
        this.productlistfilter.productIdList.push(element);
      });

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/skinConsult/getProductList`,
        null,
        this.$headers,
        this.productlistfilter
      );
      if (data.result == 1) {
        this.isBusy = false;
        this.productlistitems = data.detail.dataList;
        this.productlistrows = data.detail.count;
      }
    },
    // getProductSampleData: async function() {
    //   this.isBusy = true;
    //   this.productlistfilter.productId = this.form.productId;

    //   let product = await this.$callApi(
    //     "post",
    //     `${this.$baseUrl}/api/coupon/getProductList`,
    //     null,
    //     this.$headers,
    //     this.productlistfilter
    //   );

    //   if (product.result == 1) {
    //     this.isBusy = false;
    //     this.productlistitems = product.detail.dataList;
    //     this.productlistrows = product.detail.count;
    //   }
    // },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.skinConsult.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.skinConsult.mainLanguageId = this.languageActive;
          let data = this.form.skinConsult.translationList.filter(
            val => val.languageId == this.form.skinConsult.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.skinConsult.translationList.length;
                index++
              ) {
                this.form.skinConsult.translationList[index].name = data.name;
                this.form.skinConsult.translationList[index].altTag =
                  data.altTag;
                this.form.skinConsult.translationList[index].causes =
                  data.causes;
                this.form.skinConsult.translationList[index].solutions =
                  data.solutions;
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

          let data = this.form.skinConsult.translationList.filter(
            val => val.languageId != this.form.skinConsult.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.name = "";
              data.altTag = "";
              data.causes = "";
              data.solutions = "";
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
            this.$v.form.skinConsult.translationList.$each.$iter[index].$error
          ) {
            this.languageActive = this.$v.form.skinConsult.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    checkForm: async function(flag) {
      if (this.form.skinConsult.isSameLanguage) {
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
        `${this.$baseUrl}/api/skinConsult/saveSkinConsult`,
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
          `${this.$baseUrl}/api/skinConsult/removeSkinConsult/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/skinconsultation";
        }
      }
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.productlistfilter.pageNo = 1;
        this.getProductList();
      }
    },
    pagination(Page) {
      this.productlistfilter.pageNo = Page;
      this.getProductList();
    },
    hanndleChangePerpage(value) {
      this.productlistfilter.pageNo = 1;
      this.productlistfilter.perPage = value;
      this.getProductList();
    },
    addEditProduct: async function(type) {
      this.isBusys = true;
      this.addProductType = type;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/coupon/getActiveProduct`,
        null,
        this.$headers,
        this.productfilter
      );

      if (data.result == 1) {
        this.productitems = data.detail.dataList;
        this.productrows = data.detail.count;
        this.isBusys = false;

        Vue.nextTick(() => {
          for (const product of this.form.productId) {
            this.selected.push(product);
          }
        });
      }

      this.$refs["addProductModal"].show();
    },
    paginationProduct(Page) {
      this.productfilter.pageNo = Page;
      this.addEditProduct();
    },
    hanndleChangePerpageProduct(value) {
      this.productfilter.pageNo = 1;
      this.productfilter.perPage = value;
      this.addEditProduct();
    },
    addProductToTable: function() {
      this.$refs["addProductModal"].hide();
      this.form.productId = [];
      for (const selected of this.selected) {
        this.form.productId.push(selected);
      }
      this.getProductSampleData(this.selected);
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
        this.form.skinConsult.imageUrl = this.images;
      };
    },
    deleteImage(value) {
      this.form.skinConsult.imageUrl = null;
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
    },
    deleteProduct(id) {
      let array = this.form.productId;
      let selected = this.selected;
      let index = array.indexOf(id);
      if (index > -1) {
        array.splice(index, 1);
        selected.splice(index, 1);
      }
      this.getProductSampleData(array);
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