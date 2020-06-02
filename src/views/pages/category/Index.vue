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
          <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoading" />
          <button
            type="button"
            class="btn btn-main button mb-2 btn-cat"
            @click="createRootCategory"
          >Create Root Category</button>
          <button
            type="button"
            class="btn btn-main button btn-cat"
            @click="createSubCategory"
          >Create Subcategory</button>

          <div>
            <template v-for="(item2, key2) in items" class>
              <div :key="`lv2-${key2}`">
                <div class="text-left">
                  <div class="pl-lv2">
                    <div :class="{ menuactive: isActive(item2.id) }">
                      <b-button
                        variant="toggle-tree"
                        v-if="parentList.indexOf(item2.id) < 0 && item2.categoryList.length > 0"
                        @click="addParent(item2.id)"
                        ref="expandAll"
                        class="mr-2"
                      >
                        <font-awesome-icon icon="plus" />
                      </b-button>
                      <b-button
                        variant="toggle-tree"
                        class="mr-2"
                        v-if="parentList.indexOf(item2.id) >= 0 && item2.categoryList.length > 0"
                        @click="deleteParent(item2.id)"
                      >
                        <font-awesome-icon icon="minus" />
                      </b-button>
                      <span
                        @click="getCategoryData(item2.id,item2.id)"
                        v-if="item2.enabled == true"
                      >{{item2.name}} ({{item2.productCount}})</span>
                      <span
                        @click="getCategoryData(item2.id,item2.id)"
                        v-else
                        class="text-secondary"
                      >{{item2.name}} ({{item2.productCount}})</span>
                    </div>
                  </div>
                </div>
              </div>
              <template v-for="(item3, key3) in item2.categoryList">
                <div :key="`lv2-${key2}-lv3-${key3}`" v-if="parentList.indexOf(item2.id) > -1">
                  <div class="text-left my-2 pl-lv3">
                    <div :class="{ menuactive: isActive(item3.id) }" class="pl-lv3-box">
                      <b-button
                        variant="toggle-tree"
                        v-if="parentList.indexOf(item3.id) < 0 && item3.categoryList.length > 0"
                        @click="addParent(item3.id)"
                        ref="expandAll"
                      >
                        <font-awesome-icon icon="plus" />
                      </b-button>
                      <b-button
                        variant="toggle-tree"
                        v-if="parentList.indexOf(item3.id) >= 0 && item3.categoryList.length > 0"
                        @click="deleteParent(item3.id)"
                      >
                        <font-awesome-icon icon="minus" />
                      </b-button>
                      <span
                        @click="getCategoryData(item3.id,item3.id)"
                        v-if="item3.enabled == true"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'circle']"
                          class="circle"
                          v-if="item3.categoryList.length == 0"
                        />
                        {{item3.name}} ({{item3.productCount}})
                      </span>
                      <span
                        @click="getCategoryData(item3.id,item3.id)"
                        v-else
                        class="text-secondary"
                      >
                        <font-awesome-icon
                          :icon="['fas', 'circle']"
                          class="circle"
                          v-if="item3.categoryList.length == 0"
                        />
                        {{item3.name}} ({{item3.productCount}})
                      </span>
                    </div>
                  </div>
                </div>

                <template v-for="(item4, key4) in item3.categoryList">
                  <div
                    :key="`lv2-${key2}-lv3-${key3}-lv3-${key4}`"
                    v-if="parentList.indexOf(item3.id) > -1"
                  >
                    <div class="text-left my-2 pl-lv3">
                      <div :class="{ menuactive: isActive(item4.id) }" class="pl-lv4-box">
                        <span
                          @click="getCategoryData(item4.id,item3.id)"
                          v-if="item4.enabled == true"
                        >
                          <font-awesome-icon :icon="['fas', 'circle']" class="circle" />
                          {{item4.name}} ({{item4.productCount}})
                        </span>
                        <span
                          @click="getCategoryData(item4.id,item3.id)"
                          v-else
                          class="text-secondary"
                        >
                          <font-awesome-icon :icon="['fas', 'circle']" class="circle" />
                          {{item4.name}} ({{item4.productCount}})
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </template>
          </div>
        </b-col>
        <b-col md="9" v-if="isLoadingData">
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
            <b-row>
              <b-col md="6">
                <b-input-group class="panel-input-serach">
                  <b-form-input
                    class="input-serach"
                    placeholder="Name, SKU"
                    @keyup="handleSearch"
                    v-model="filter.search"
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
                  v-model="isProductInCategory"
                  @change="getProductList"
                >Show only product in this category</b-form-checkbox>
              </b-col>
            </b-row>

            <b-row>
              <b-col class="mt-4 w-100">
                <b-table
                  responsive
                  striped
                  :fields="fields"
                  :items="productlist"
                  :busy="isBusy"
                  show-empty
                  empty-text="No matching records found"
                >
                  <template v-slot:cell(id)="data">
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
                      <p class="mb-0 nobreak two-lines">{{data.item.name}}</p>
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
                  v-model="filter.pageNo"
                  :total-rows="rows"
                  :per-page="filter.perPage"
                  class="m-md-0"
                  @change="pagination"
                ></b-pagination>
                <b-form-select
                  v-model="filter.perPage"
                  @change="hanndleChangePerpage"
                  :options="pageOptions"
                ></b-form-select>
              </b-col>
            </b-row>
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

export default {
  name: "Index",
  components: {
    InputText,
    InputSelect,
    HeaderLine,
    SEOSection,
    ModalAlert
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
      isLoading: false,
      isLoadingData: true,
      isDisable: false,
      imgModal: null,
      msgModal: null,
      selectAllCb: false,
      isSubCategory: false,
      imageLogoLang: "",
      languageList: [],
      selected: [],
      languageActive: 1,
      rows: 0,
      parentList: [],
      parents: [],
      categorys: [],
      items: {},
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
      },
      fields: [
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
          label: "Name",
          class: "w-200",
          tdClass: "text-left"
        },
        {
          key: "sku",
          label: "SKU",
          class: "w-100px"
        },
        {
          key: "price",
          label: "Price",
          class: "w-100px"
        }
      ],
      filter: {
        perPage: 5,
        pageNo: 1,
        search: "",
        isProductInCategory: 0,
        productIdList: []
      },
      pageOptions: [
        { value: 5, text: "5 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ]
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
    addParent(ref) {
      this.parentList.push(ref);
    },
    deleteParent(ref) {
      var index = this.parentList.indexOf(ref);
      if (index !== -1) this.parentList.splice(index, 1);
    },
    isActive: function(menuItem) {
      return this.activeItem == menuItem;
    },
    handleChangeCategoryType: async function(value) {
      this.form.category.categoryTypeId = value;
    },
    handleChangeParentCategory: async function(value) {
      this.form.category.parentId = value;
    },
    getList: async function() {
      this.isLoading = true;
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
        this.parents.push(this.items.id);
        this.activeItem = this.items[0].id;
        this.isLoading = false;
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
          } else {
            this.isSubCategory = true;
          }
        }
      }

      this.activeItem = id;
      this.parentIdSelected = parentid;

      console.log(this.parentIdSelected)

      await this.getProductList();
    },
    getProductList: async function() {
      this.isBusy = true;

      Vue.nextTick(() => {
        if (this.isProductInCategory == true) {
          this.filter.isProductInCategory = 1;
        } else {
          this.filter.isProductInCategory = 0;
        }
      });

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
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.pageNo = 1;
        this.getProductList();
      }
    },
    pagination(Page) {
      this.filter.pageNo = Page;
      this.getProductList();
    },
    hanndleChangePerpage(value) {
      this.filter.pageNo = 1;
      this.filter.perpage = value;
      this.getProductList();
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
        this.categoryId = data.detail.categoryId;
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
    createSubCategory: async function() {
      this.isSubCategory = true;
      await this.getCategoryData(0, this.parentIdSelected);
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
      this.isProductInCategory = true;
      this.activeItem = this.categoryId;
      this.addParent(this.parentCategoryId);
      await this.getCategoryData(this.categoryId);
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
    }
  }
};
</script>

<style scoped>
.pl-lv2 {
  padding-top: 15px;
  color: #0d1730;
  font-size: 16px;
}

.pl-lv2 span {
  cursor: pointer;
}

.pl-lv3 span {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #0d1730;
  font-size: 16px;
  cursor: pointer;
}

.pl-lv3-box,
.pl-lv3-box .menuactive {
  padding-left: 10% !important;
}

.pl-lv4-box,
.pl-lv4-box .menuactive {
  padding-left: 20% !important;
}

.btn-cat {
  width: 100%;
}

.menuactive {
  font-weight: bold;
  background-color: #321fdb;
  padding: 3px 0;
  color: #fff;
}

.menuactive span {
  color: #fff;
}

.circle {
  width: 5px;
}
</style>