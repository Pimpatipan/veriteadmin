<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol lg="6" class="text-center text-lg-left">
        <h1 class="mr-sm-4">CATEGORY LIST</h1>
      </CCol>
    </CRow>
    <div class="bg-white-border px-4 px-sm-5 py-4 mt-4 text-dark">
      <b-row>
        <b-col md="3">
          <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoadingData" />
          <CategoryList
            :items="items"
            :activeItem="activeItem"
            :parentList="parentList"
            @handleSetRootCategoryData="createRootCategory"
            @handleSetSubCategoryData="createSubCategory"
            @handleGetCategoryData="getCategoryData"
          />
        </b-col>
        <b-col md="9" v-if="isLoadingData" class="vh-100">
          <img src="/img/loading.svg" class="loading" alt="loading" />
        </b-col>
        <b-col md="9" v-else>
          <b-row class="pl-1 mb-4 mt-5 mt-md-0">
            <b-col cols="6">
              <div class="panel d-flex align-items-md-center">
                <b-form-checkbox
                  size="lg"
                  id="sameLang"
                  class="mt-0 mt-sm-3"
                  @change="useSameLanguage"
                  v-model="form.category.isSameLanguage"
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
                :disabled="form.category.isSameLanguage ? true : false "
              >
                <span class="text-uppercase">{{language.nation}}</span>
              </b-button>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <div v-for="(item, index) in form.category.translationList" v-bind:key="index">
                <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                  <InputText
                    textFloat="Category Name"
                    placeholder="Category Name"
                    type="text"
                    name="name"
                    isRequired
                    v-model="item.name"
                    :img="imageLogoLang"
                    :isValidate="$v.form.category.translationList.$each.$iter[index].name.$error"
                    :v="$v.form.category.translationList.$each.$iter[index].name"
                    @onKeyup="setSeoAndUrlkey(item.name,index)"
                  />
                </div>
              </div>
            </b-col>
            <b-col md="6">
              <div class="position-relative">
                <InputText
                  textFloat="URL Key"
                  placeholder="URL Key"
                  type="text"
                  name="urlkey"
                  isRequired
                  v-model="form.category.urlKey"
                  :isValidate="$v.form.category.urlKey.$error"
                  :v="$v.form.category.urlKey"
                  @onKeyup="onUrlkeyChange"
                />
                <div v-if="form.category.id != 0">
                  <!-- <a
                    :href="'http://verite.dosetech.co/categories/'+categoryMainName+'/'+form.category.urlKey+'/All'"
                    target="_blank"
                    class="view-txt"
                    v-if="isSubCategoryLink"
                  >View</a>
                  <a
                    :href="'http://verite.dosetech.co/categories/'+form.category.urlKey+'/All/All'"
                    target="_blank"
                    class="view-txt"
                    v-else
                  >View</a> -->

                  <a
                    :href="'https://verite.co.th/categories/'+categoryMainName+'/'+form.category.urlKey+'/All'"
                    target="_blank"
                    class="view-txt"
                    v-if="isSubCategoryLink"
                  >View</a>
                  <a
                    :href="'https://verite.co.th/categories/'+form.category.urlKey+'/All/All'"
                    target="_blank"
                    class="view-txt"
                    v-else
                  >View</a>
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
                v-model="form.category.sortOrder"
                @onKeypress="isNumber($event)"
              />
            </b-col>
            <b-col md="6">
              <InputSelect
                title="Category Type"
                name="type"
                v-model="form.category.categoryTypeId"
                isRequired
                v-bind:options="form.categoryType"
                valueField="id"
                textField="name"
                @onDataChange="handleChangeCategoryType"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="6">
              <label class="font-weight-bold main-label">
                Status
                <span class="text-danger">*</span>
              </label>
              <div>
                <b-form-checkbox
                  switch
                  v-model="form.category.enabled"
                  class="radio-active"
                  size="lg"
                >
                  <span class="ml-2 main-label">{{form.category.enabled ? 'Active' : 'Inactive' }}</span>
                </b-form-checkbox>
              </div>
            </b-col>
            <b-col cols="6">
              <label class="font-weight-bold main-label">
                Display Status
                <span class="text-danger">*</span>
              </label>
              <div>
                <b-form-checkbox
                  switch
                  v-model="form.category.display"
                  class="radio-active"
                  size="lg"
                >
                  <span class="ml-2 main-label">{{form.category.display ? 'Active' : 'Inactive' }}</span>
                </b-form-checkbox>
              </div>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col md="6" v-if="isSubCategory">
              <InputSelect
                title="Parent Category"
                name="type"
                v-model="form.category.parentId"
                isRequired
                v-bind:options="categorys"
                valueField="id"
                textField="name"
                @onDataChange="handleChangeParentCategory"
              />
            </b-col>
          </b-row>

          <HeaderLine text="Product list" class="my-4" />

          <div class="mt-5">
            <ProductList
              @getProductList="getProductList"
              :productlist="productlist"
              :rows="rows"
              :isBusy="isBusy"
              :idList="form.productId"
              @handleChangePagination="pagination"
              @handleChangePerpage="handleChangePerpage"
              @handleSearch="handleSearch"
            />
          </div>

          <SEOSection
            class="mt-5"
            :img="imageLogoLang"
            :langActive="languageActive"
            :data="form.category.translationList"
            :isValidate="$v.form.category.translationList"
            :v="$v.form.category.translationList"
          />

          <b-row class="mt-5">
            <b-col md="6">
              <b-button
                class="btn btn-danger btn-details-set mr-md-2"
                @click="deleteData()"
                v-if="isEdit"
                :disabled="isDisable"
              >REMOVE</b-button>
            </b-col>
            <b-col md="6" class="text-sm-right">
              <button
                :disabled="isDisable"
                @click="checkForm(0)"
                type="button"
                class="btn btn-success btn-details-set ml-md-2 text-uppercase"
              >Save</button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
    <ModalAlert
      v-if="modalAlertShow"
      :msg="msgModal"
      :img="imgModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
    />
  </CContainer>
</template>

<script>
import Vue from "vue";
import { required } from "vuelidate/lib/validators";
import InputText from "@/components/inputs/InputText";
import InputSelect from "@/components/inputs/InputSelect";
import HeaderLine from "@/components/HeaderLine";
import SEOSection from "@/components/inputs/SEOSection";
import ModalAlert from "@/components/ModalAlert";
import CategoryList from "./components/CategoryList";
import ProductList from "@/components/product/ProductList";

export default {
  name: "Index",
  components: {
    InputText,
    InputSelect,
    HeaderLine,
    SEOSection,
    ModalAlert,
    CategoryList,
    ProductList
  },
  data() {
    return {
      parentCategoryId: 0,
      parentIdSelected: 1,
      categoryId: 0,
      isBusy: false,
      modalAlertShow: false,
      isInit: true,
      isProductInCategory: true,
      activeItem: 0,
      checkAll: false,
      isEdit: false,
      isSuccess: false,
      isLoadingData: true,
      isDisable: false,
      imgModal: null,
      msgModal: null,
      isSubCategory: false,
      isSubCategoryLink: false,
      categoryMainName: "",
      imageLogoLang: "",
      languageList: [],
      languageActive: 1,
      rows: 0,
      parentList: [],
      categorys: [],
      items: {},
      filter: {
        perPage: 5,
        pageNo: 1,
        search: "",
        isProductInCategory: 0,
        productIdList: []
      },
      productlist: [],
      form: {
        category: {
          id: 0,
          categoryTypeId: 0,
          sortOrder: 0,
          urlKey: null,
          enabled: false,
          display: false,
          mainLanguageId: 0,
          isSameLanguage: false,
          parentId: 0,
          translationList: [
            {
              languageId: 1,
              name: null,
              metaTitle: null,
              metaKeyword: null,
              metaDescription: null
            },
            {
              languageId: 2,
              name: null,
              metaTitle: null,
              metaKeyword: null,
              metaDescription: null
            }
          ]
        },
        productId: [],
        categoryType: [
          {
            id: 1,
            name: "Normal"
          },
          {
            id: 2,
            name: "New Arrival"
          },
          {
            id: 3,
            name: "Best Seller"
          }
        ]
      }
    };
  },
  validations: {
    form: {
      category: {
        urlKey: { required },
        translationList: {
          $each: {
            name: { required },
            metaTitle: { required },
            metaKeyword: { required },
            metaDescription: { required }
          }
        }
      }
    }
  },
  created: async function() {
    await this.getList();
    await this.getParentCategoryList();
    await this.getCategoryData(this.items[0].id, this.items[0].id);
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
    handleChangeCategoryType: async function(value) {
      this.form.category.categoryTypeId = value;
    },
    handleChangeParentCategory: async function(value) {
      this.form.category.parentId = value;
    },
    getList: async function() {
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
        `${this.$baseUrl}/api/category/categoryHierarchy`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.items = data.detail;
        this.activeItem = this.items[0].id;
        this.isLoadingData = false;
      }
    },
    getParentCategoryList: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/category/categoryList`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.categorys = data.detail;
      }
    },
    getCategoryData: async function(id, parentid) {
      this.isLoadingData = true;
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/category/${id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.isLoadingData = false;
        this.form = data.detail;
        this.$v.form.$reset();

        if (this.form.category.id == 0) {
          this.form.category.categoryTypeId = 1;
        } else {
          this.isEdit = true;

          if (this.form.category.parentId == 0) {
            this.isSubCategory = false;
            this.isSubCategoryLink = false;
          } else {
            this.isSubCategory = true;
            this.isSubCategoryLink = true;

            var name = this.categorys.find(
              x => x.id == this.form.category.parentId
            );
            if (name != null) {
              this.categoryMainName = name.urlKey;
            }

            this.categorys = this.categorys.filter(
              x => x.id != this.form.category.id
            );
          }
        }

        if (this.form.category.isSameLanguage) {
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

      this.activeItem = id;
      this.parentIdSelected = parentid;

      await this.getProductList();
    },
    getProductList: async function(value, page, list) {
      this.isBusy = true;

      if (list != null) this.form.productId = list;

      if (page != null && this.filter.pageNo != 1) {
        this.filter.pageNo = 1;
      }

      if (value == true || value == null) {
        this.filter.isProductInCategory = 1;
      } else {
        this.filter.isProductInCategory = 0;
      }

      this.filter.productIdList = [];

      await this.form.productId.forEach((element, index) => {
        this.filter.productIdList.push(element);
      });

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/category/getProductList`,
        null,
        this.$headers,
        this.filter
      );
      if (data.result == 1) {
        this.productlist = data.detail.dataList;
        this.rows = data.detail.count;
        this.isBusy = false;
        this.isInit = false;
      }
    },
    useSameLanguage() {
      Vue.nextTick(() => {
        if (this.form.category.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.category.mainLanguageId = this.languageActive;
          let data = this.form.category.translationList.filter(
            val => val.languageId == this.form.category.mainLanguageId
          );

          if (this.form.category.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.category.translationList.length;
                index++
              ) {
                this.form.category.translationList[index].name = data.name;
                this.form.category.translationList[index].metaTitle =
                  data.metaTitle;
                this.form.category.translationList[index].metaKeyword =
                  data.metaKeyword;
                this.form.category.translationList[index].metaDescription =
                  data.metaDescription;
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

          let data = this.form.category.translationList.filter(
            val => val.languageId != this.form.category.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.name = "";
              data.metaTitle = "";
              data.metaKeyword = "";
              data.metaDescription = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList() {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (this.$v.form.category.translationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.category.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    checkForm: async function(flag) {
      if (this.form.category.isSameLanguage) {
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
      this.parentCategoryId = this.form.category.parentId;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/category/save `,
        null,
        this.$headers,
        this.form
      );

      this.modalAlertShow = true;
      if (data.result == 1) {
        this.imgModal = "/img/icon-check-green.png";
        this.msgModal = data.message;
        this.isSuccess = true;
        this.categoryId = data.detail.id;
      } else {
        this.imgModal = "/img/icon-unsuccess.png";
        this.msgModal = data.detail[0];
        this.isSuccess = false;
      }

      this.isDisable = false;
    },
    createRootCategory: async function() {
      this.isSubCategory = false;
      this.form.category.parentId = 0;
      this.getCategoryData(0, this.parentIdSelected);
      this.filter.productIdList = [];
      this.getProductList();
    },
    createSubCategory: async function(id) {
      this.isSubCategory = true;
      await this.getCategoryData(0, id);
      this.form.category.parentId = this.parentIdSelected;
      this.filter.productIdList = [];
      await this.getProductList();
    },
    setSeoAndUrlkey: function(name, index) {
      this.form.category.translationList[index].metaTitle = name;
      this.form.category.translationList[index].metaKeyword = name;
      this.form.category.translationList[index].metaDescription = name;
      this.form.category.urlKey = name.replace(/ /g, "-").replace(/\//g, "");
    },
    onUrlkeyChange: function(value) {
      this.form.category.urlKey = this.form.category.urlKey
        .replace(/ /g, "-")
        .replace(/\//g, "");
    },
    handleCloseModal: async function() {
      await this.getList();
      await this.getParentCategoryList();
      this.isProductInCategory = true;
      this.activeItem = this.categoryId;
      this.addParent(this.parentCategoryId);
      await this.getCategoryData(this.categoryId);
    },
    addParent(ref) {
      this.parentList.push(ref);
    },
    deleteData: async function() {
      if (confirm("Are you sure you want to delete this data?") == true) {
        this.parentCategoryId = this.form.category.parentId;

        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/category/removeCategory/${this.form.category.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          await this.getList();
          if (this.parentCategoryId != 0) {
            await this.getCategoryData(this.parentCategoryId);
            this.activeItem = this.parentCategoryId;
          } else {
            await this.getCategoryData(this.items[0].id);
            this.activeItem = this.items[0].id;
          }
        }
      }
    },
    handleSearch(search, value) {
      this.filter.search = search;
      this.filter.pageNo = 1;
      this.getProductList(this.filter.isProductInCategory);
    },
    pagination(Page, value) {
      this.filter.pageNo = Page;
      this.getProductList(this.filter.isProductInCategory);
    },
    handleChangePerpage(perpage, value) {
      this.filter.pageNo = 1;
      this.filter.perpage = perpage;
      this.getProductList(this.filter.isProductInCategory);
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