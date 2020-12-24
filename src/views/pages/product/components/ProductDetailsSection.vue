<template>
  <div>
    <form class="form-box">
      <b-row class="no-gutters bg-white-border">
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
                  @change="useSameLanguage(1)"
                  v-model="productdetail.product.isSameLanguage"
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
                :disabled="productdetail.product.isSameLanguage ? true : false "
              >
                <span class="text-uppercase">{{language.nation}}</span>
              </b-button>
            </b-col>
          </b-row>

          <div v-for="(item, index) in productdetail.product.translationList" v-bind:key="index">
            <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
              <InputText
                class="mb-4"
                textFloat="Product Name"
                placeholder="Product Name"
                type="text"
                name="name"
                isRequired
                :img="imageLogoLang"
                v-model="item.name"
                @onKeyup="setMetaTitleandKeyword(item.name,index)"
                :isValidate="$v.productdetail.product.translationList.$each.$iter[index].name.$error"
                :v="$v.productdetail.product.translationList.$each.$iter[index].name"
              />
            </div>

            <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
              <InputTextArea
                class="mb-4"
                textFloat="Short Description"
                placeholder="Short Description"
                type="text"
                name="shortdescription"
                isRequired
                rows="5"
                :img="imageLogoLang"
                v-model="item.shortDescription"
                @onKeyup="setMetaDescription(item.shortDescription,index)"
                :isValidate="$v.productdetail.product.translationList.$each.$iter[index].shortDescription.$error"
                :v="$v.productdetail.product.translationList.$each.$iter[index].shortDescription"
              />
            </div>
          </div>

          <b-row>
            <b-col md="6">
              <InputText
                textFloat="SKU"
                placeholder="SKU"
                type="text"
                name="sku"
                isRequired
                v-model="productdetail.product.sku"
                :isValidate="$v.productdetail.product.sku.$error"
                :v="$v.productdetail.product.sku"
              />
            </b-col>
            <b-col md="6">
              <InputText
                textFloat="Barcode"
                placeholder="Barcode"
                type="text"
                name="barcode"
                isRequired
                @onKeypress="isNumber($event)"
                v-model="productdetail.product.barcode"
                :isValidate="$v.productdetail.product.barcode.$error"
                :v="$v.productdetail.product.barcode"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <div class="position-relative">
                <InputText
                  textFloat="URL Key"
                  placeholder="URL Key"
                  type="text"
                  name="urlkey"
                  isRequired
                  v-model="productdetail.product.urlKey"
                  :isValidate="$v.productdetail.product.urlKey.$error"
                  :v="$v.productdetail.product.urlKey"
                  @onKeyup="onUrlkeyChange"
                />
                <!-- <a
                  :href="'http://verite.dosetech.co/product/'+productdetail.product.urlKey"
                  target="_blank"
                  class="view-txt"
                  v-if="id != 0"
                >View</a>-->
                <a
                  :href="'https://www.verite.co.th/product/'+productdetail.product.urlKey"
                  target="_blank"
                  class="view-txt"
                  v-if="id != 0"
                >View</a>
              </div>
            </b-col>
            <b-col md="6">
              <InputText
                textFloat="Price"
                placeholder="Price"
                type="text"
                name="price"
                isRequired
                @onKeypress="isNumber($event)"
                v-model="productdetail.product.price"
                :isValidate="$v.productdetail.product.price.$error"
                :v="$v.productdetail.product.price"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <InputText
                textFloat="Size"
                placeholder="Size"
                type="text"
                name="size"
                isRequired
                v-model="productdetail.product.size"
                :isValidate="$v.productdetail.product.size.$error"
                :v="$v.productdetail.product.size"
              />
            </b-col>
            <b-col md="6">
              <InputText
                textFloat="Sort Order"
                placeholder="Sort Order"
                type="text"
                name="sortorder"
                isRequired
                v-model="productdetail.product.sortOrder"
                @onKeypress="isNumber($event)"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <label class="font-weight-bold label-text">Parent Category</label>

              <div class="store-type-box px-4 mb-4">
                <!-- <div v-for="(item,index) in categorys" v-bind:key="index">
                  <b-form-checkbox
                    size="lg"
                    class="my-3"
                    :value="item.id"
                    v-model="productdetail.product.selectCategory"
                  >{{item.name}}</b-form-checkbox>

                  <b-form-checkbox
                    size="lg"
                    class="mt-3 ml-4"
                    v-for="(items,indexs) in item.categoryList"
                    v-bind:key="indexs"
                    :value="items.id"
                    v-model="productdetail.product.selectCategory"
                    @change="checkSubCategorychecked(index,items.id,item.id)"
                  >{{items.name}}</b-form-checkbox>
                </div>-->

                <div>
                  <template v-for="(item2, key2) in categorys">
                    <div :key="`lv2-${key2}`">
                      <div class="text-left my-3">
                        <div class="pl-lv2">
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
                          <div class="parent-cat">
                            <b-form-checkbox
                              size="lg"
                              :value="item2.id"
                              v-model="productdetail.product.selectCategory"
                            >
                              <span
                                v-if="item2.enabled == true"
                              >{{item2.name}} ({{item2.productCount}})</span>
                              <span
                                v-else
                                class="text-secondary"
                              >{{item2.name}} ({{item2.productCount}})</span>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </div>
                    </div>
                    <template v-for="(item3, key3) in item2.categoryList">
                      <div
                        :key="`lv2-${key2}-lv3-${key3}`"
                        v-if="parentList.indexOf(item2.id) > -1"
                      >
                        <div class="text-left my-3 pl-lv3">
                          <div class="ml-4">
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

                            <div class="parent-cat">
                              <b-form-checkbox
                                size="lg"
                                class="mt-1 ml-1"
                                v-bind:key="key3"
                                :value="item3.id"
                                v-model="productdetail.product.selectCategory"
                                @change="checkSubCategorychecked(key2,item3.id,item2.id)"
                              >
                                <span
                                  v-if="item3.enabled == true"
                                >{{item3.name}} ({{item3.productCount}})</span>
                                <span
                                  v-else
                                  class="text-secondary"
                                >{{item3.name}} ({{item3.productCount}})</span>
                              </b-form-checkbox>
                            </div>
                          </div>
                        </div>
                      </div>

                      <template v-for="(item4, key4) in item3.categoryList">
                        <div
                          :key="`lv2-${key2}-lv3-${key3}-lv4-${key4}`"
                          v-if="parentList.indexOf(item3.id) > -1"
                        >
                          <div class="text-left my-3 pl-lv4">
                            <b-form-checkbox
                              size="lg"
                              class="mt-4 pl-lv4-cb"
                              v-bind:key="key4"
                              :value="item4.id"
                              v-model="productdetail.product.selectCategory"
                              @change="checkSubCategoryLevel2checked(key2,key3,item4.id,item3.id,item2.id)"
                            >
                              <span
                                v-if="item4.enabled == true"
                              >{{item4.name}} ({{item4.productCount}})</span>
                              <span
                                v-else
                                class="text-secondary"
                              >{{item4.name}} ({{item4.productCount}})</span>
                            </b-form-checkbox>
                          </div>
                        </div>
                      </template>
                    </template>
                  </template>
                </div>
              </div>
              <!-- <p
                v-if="$v.productdetail.product.selectCategory.$error"
                class="text-danger"
              >Please select at least one category</p>-->
            </b-col>
            <b-col md="6">
              <label class="font-weight-bold main-label">Tag</label>
              <div class="panel d-md-flex align-items-md-center ml-2 mt-2 mb-3">
                <b-form-checkbox
                  size="lg"
                  value="1"
                  v-model="productdetail.product.tagId"
                >New Arrival</b-form-checkbox>
                <b-form-checkbox
                  size="lg"
                  value="2"
                  v-model="productdetail.product.tagId"
                  class="ml-md-5 my-2 my-md-0"
                >Hot</b-form-checkbox>
              </div>

              <InputSelect
                title="Unit"
                name="unit"
                v-model="productdetail.product.productUnitId"
                isRequired
                v-bind:options="unitList"
                valueField="id"
                textField="name"
                @onDataChange="handleChangeUnit"
              />
            </b-col>
          </b-row>

          <div class="position-relative">
            <button
              class="btn btn-secondary seo-btn"
              type="button"
              data-toggle="collapse"
              data-target="#collapseExample1"
              aria-expanded="true"
              aria-controls="collapseExample1"
            >Product Details</button>
            <font-awesome-icon icon="sort-down" class="arrow-logo r-15" />
          </div>
          <div class="collapse show" id="collapseExample1">
            <div class="card card-body">
              <div
                v-for="(item, index) in productdetail.product.translationList"
                v-bind:key="index"
              >
                <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                  <b-row>
                    <b-col>
                      <TextEditor
                        textFloat="Product Details"
                        :rows="8"
                        :img="imageLogoLang"
                        placeholder="Type something..."
                        :name="'prodetail'+item.languageId"
                        :value="item.description"
                        @onDataChange="(val) => item.description = val"
                      />
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <div class="position-relative">
              <button
                class="btn btn-secondary seo-btn"
                type="button"
                data-toggle="collapse"
                data-target="#collapseExample2"
                aria-expanded="false"
                aria-controls="collapseExample2"
              >How to use</button>
              <font-awesome-icon icon="sort-down" class="arrow-logo r-15" />
            </div>
            <div class="collapse" id="collapseExample2">
              <div class="card card-body">
                <div
                  v-for="(item, index) in productdetail.product.translationList"
                  v-bind:key="index"
                >
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <b-row>
                      <b-col>
                        <TextEditor
                          textFloat="How to use"
                          :rows="8"
                          :img="imageLogoLang"
                          placeholder="Type something..."
                          :name="'howtouse'+item.languageId"
                          :value="item.howToUse"
                          @onDataChange="(val) => item.howToUse = val"
                        />
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-3">
            <div class="position-relative">
              <button
                class="btn btn-secondary seo-btn"
                type="button"
                data-toggle="collapse"
                data-target="#collapseExample3"
                aria-expanded="false"
                aria-controls="collapseExample3"
              >Ingredients</button>
              <font-awesome-icon icon="sort-down" class="arrow-logo r-15" />
            </div>
            <div class="collapse" id="collapseExample3">
              <div class="card card-body">
                <div
                  v-for="(item, index) in productdetail.product.translationList"
                  v-bind:key="index"
                >
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <b-row>
                      <b-col>
                        <TextEditor
                          textFloat="Ingredients"
                          :rows="8"
                          :img="imageLogoLang"
                          placeholder="Type something..."
                          :name="'ingredients'+item.languageId"
                          :value="item.ingredient"
                          @onDataChange="(val) => item.ingredient = val"
                        />
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SEOSection
            :img="imageLogoLang"
            :langActive="languageActive"
            :data="productdetail.product.translationList"
            :isValidate="$v.productdetail.product.translationList"
            :v="$v.productdetail.product.translationList"
          />

          <div class="text-right mt-3" @click="clearDate" v-if="productdetail.product.display">
            <span class="text-secondary text-underline pointer">Clear</span>
          </div>

          <b-row v-if="productdetail.product.display">
            <b-col sm="6">
              <label class="label-text">Valid from</label>
              <datetime
                v-model="productdetail.product.startDateDisplay"
                placeholder="Please select date"
                class="date-picker"
                format="dd/MM/yyyy"
                value-zone="local"
              ></datetime>
              <p class="text-danger" v-if="error">The Valid from date must be earlier than end date</p>
            </b-col>
            <b-col sm="6">
              <label class="label-text">Valid to</label>
              <datetime
                v-model="productdetail.product.endDateDisplay"
                placeholder="Please select date"
                class="date-picker"
                format="dd/MM/yyyy"
                value-zone="local"
              ></datetime>
            </b-col>
          </b-row>

          <b-row class="mt-4">
            <b-col sm="6" class="mb-4 mb-sm-0">
              <label class="font-weight-bold main-label">
                Status
                <span class="text-danger">*</span>
              </label>
              <div>
                <b-form-checkbox
                  switch
                  v-model="productdetail.product.enabled"
                  class="radio-active"
                  size="lg"
                >
                  <span
                    class="ml-2 main-label"
                  >{{productdetail.product.enabled ? 'Active' : 'Inactive' }}</span>
                </b-form-checkbox>
              </div>
            </b-col>
            <b-col sm="6">
              <label class="font-weight-bold main-label">
                Display Status
                <span class="text-danger">*</span>
              </label>
              <div>
                <b-form-checkbox
                  switch
                  v-model="productdetail.product.display"
                  class="radio-active"
                  size="lg"
                >
                  <span
                    class="ml-2 main-label"
                  >{{productdetail.product.display ? 'Active' : 'Inactive' }}</span>
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
              <b-button href="/product" :disabled="isDisable" class="btn-details-set">CANCEL</b-button>
            </b-col>
            <b-col md="6" class="text-sm-right">
              <button
                :disabled="isDisable"
                @click="checkForm(0)"
                type="button"
                class="btn btn-success btn-details-set ml-md-2 text-uppercase"
              >Save</button>
              <button
                :disabled="isDisable"
                @click="checkForm(1)"
                type="button"
                class="btn btn-success btn-details-set ml-md-2 text-uppercase"
              >Save & Exit</button>
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
import { required, requiredIf } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";
import TextEditor from "@/components/inputs/TextEditor";
import InputTextArea from "@/components/inputs/InputTextArea";
import SEOSection from "@/components/inputs/SEOSection";
import InputSelect from "@/components/inputs/InputSelect";

export default {
  name: "ProductDetailsDetails",
  components: {
    InputText,
    ModalAlert,
    TextEditor,
    InputTextArea,
    SEOSection,
    InputSelect,
  },
  data() {
    return {
      id: this.$route.params.id,
      languageList: [],
      existId: "",
      items: [],
      parentList: [],
      imageLogoLang: "",
      languageActive: 1,
      isDisable: false,
      isLoadingData: false,
      error: false,
      isEdit: false,
      imgModal: null,
      isSuccess: false,
      msgModal: null,
      modalAlertShow: false,
      categorys: [
        {
          categoryList: [],
        },
      ],
      unitList: [],
      productdetail: {
        product: {
          id: 0,
          sortOrder: 0,
          price: 0.0,
          productUnitId: 0,
          enabled: false,
          display: false,
          sku: null,
          barcode: null,
          urlKey: null,
          size: null,
          startDateDisplay: null,
          endDateDisplay: null,
          mainLanguageId: 0,
          isSameLanguage: false,
          tagId: [],
          translationList: [
            {
              languageId: 1,
              name: null,
              shortDescription: null,
              description: null,
              metaTitle: null,
              metaKeyword: null,
              metaDescription: null,
              howToUse: null,
              ingredient: null,
            },
            {
              languageId: 2,
              name: null,
              shortDescription: null,
              description: null,
              imageAltTag: null,
              hoverImageAltTag: null,
              metaTitle: null,
              metaKeyword: null,
              metaDescription: null,
              howToUse: null,
              ingredient: null,
            },
          ],
          selectCategory: [],
        },
      },
    };
  },
  validations: {
    productdetail: {
      product: {
        price: { required },
        sku: { required },
        barcode: { required },
        urlKey: { required },
        size: { required },
        translationList: {
          $each: {
            name: { required },
            shortDescription: { required },
            metaTitle: { required },
            metaKeyword: { required },
            metaDescription: { required },
          },
        },
      },
    },
  },
  created: async function () {
    this.isLoadingData = true;
    await this.getLanguage();
  },
  methods: {
    getLanguage: async function () {
      let languages = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/language`,
        null,
        this.$headers,
        null
      );
      if (languages.result == 1) {
        this.$languages = languages.detail;
        this.languageList = languages.detail;
        this.changeLanguage(1, 0);
        await this.getDatas();
      }
    },
    handleChangeUnit: async function (value) {
      this.productdetail.product.productUnitId = value;
    },
    clearDate() {
      this.productdetail.product.startDateDisplay = null;
      this.productdetail.product.endDateDisplay = null;
    },
    addParent(ref) {
      this.parentList.push(ref);
    },
    deleteParent(ref) {
      var index = this.parentList.indexOf(ref);
      if (index !== -1) this.parentList.splice(index, 1);
    },
    handleCloseModal: async function () {
      if (this.flag == 1) {
        window.location.href = "/product";
      } else {
        if (this.id > 0) {
          this.isLoadingData = true;
          this.getDatas();
        } else {
          this.productdetail.product.id = this.existId;
          this.id = this.existId;
          this.isEdit = true;
          this.$router.push({ path: `/product/details/${this.existId}` });
        }
      }
    },
    useSameLanguage: async function (flag) {
      Vue.nextTick(() => {
        if (this.productdetail.product.isSameLanguage) {
          this.imageLogoLang = "";
          this.productdetail.product.mainLanguageId = this.languageActive;
          let data = this.productdetail.product.translationList.filter(
            (val) => val.languageId == this.productdetail.product.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.productdetail.product.translationList.length;
                index++
              ) {
                this.productdetail.product.translationList[index].name =
                  data.name;
                this.productdetail.product.translationList[
                  index
                ].shortDescription = data.shortDescription;
                this.productdetail.product.translationList[index].description =
                  data.description;
                this.productdetail.product.translationList[index].metaTitle =
                  data.metaTitle;
                this.productdetail.product.translationList[index].metaKeyword =
                  data.metaKeyword;
                this.productdetail.product.translationList[
                  index
                ].metaDescription = data.metaDescription;
                this.productdetail.product.translationList[index].howToUse =
                  data.howToUse;
                this.productdetail.product.translationList[index].ingredient =
                  data.ingredient;
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

          let data = this.productdetail.product.translationList.filter(
            (val) => val.languageId != this.productdetail.product.mainLanguageId
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
              data.howToUse = "";
              data.ingredient = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList: async function () {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (
            this.$v.productdetail.product.translationList.$each.$iter[index]
              .$error
          ) {
            this.languageActive = this.$v.productdetail.product.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    setMetaTitleandKeyword: function (name, index) {
      this.productdetail.product.translationList[index].metaTitle = name;
      this.productdetail.product.translationList[index].metaKeyword = name;
      this.productdetail.product.urlKey = name
        .replace(/ /g, "-")
        .replace(/\//g, "");
    },
    setMetaDescription: function (name, index) {
      this.productdetail.product.translationList[index].metaDescription = name;
    },
    onUrlkeyChange: function (value) {
      this.productdetail.product.urlKey = this.productdetail.product.urlKey
        .replace(/ /g, "-")
        .replace(/\//g, "");
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    checkForm: async function (flag) {
      if (this.productdetail.product.isSameLanguage) {
        await this.useSameLanguage();
      }
      this.$v.productdetail.$touch();
      if (this.$v.productdetail.$error) {
        await this.checkValidateTranslationList();
        return;
      }

      if (
        new Date(this.productdetail.product.endDateDisplay) <
        new Date(this.productdetail.product.startDateDisplay)
      ) {
        this.error = true;
        return;
      }

      this.modalAlertShow = false;
      this.flag = flag;
      this.submit();
    },
    submit: async function () {
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/productDetail/save`,
        null,
        this.$headers,
        this.productdetail
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
    getDatas: async function () {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/productDetail/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.productdetail = data.detail;
        this.isLoadingData = false;
        this.$v.productdetail.$reset();

        if (this.id > 0) {
          this.isEdit = true;

          await this.$cookies.set(
            "product_name_th",
            this.productdetail.product.translationList[0].name,
            60 * 60 * 24 * 30
          );

          await this.$cookies.set(
            "product_name_en",
            this.productdetail.product.translationList[1].name,
            60 * 60 * 24 * 30
          );
        }

        if (this.productdetail.product.productUnitId == 0) {
          this.productdetail.product.productUnitId = 1;
        }

        if (this.productdetail.product.isSameLanguage) {
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

      let cat = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/category/categoryHierarchy`,
        null,
        this.$headers,
        null
      );

      if (cat.result == 1) {
        this.categorys = cat.detail;
      }

      let unit = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/unitList`,
        null,
        this.$headers,
        null
      );

      if (cat.result == 1) {
        this.unitList = unit.detail;
      }
    },
    isNumber: function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    checkSubCategorychecked: function (index, val, mainId) {
      let arrayFlag = false;
      let length = this.categorys[index].categoryList.length;
      let firstId = this.categorys[index].categoryList[0].id;
      let lastId = this.categorys[index].categoryList[length - 1].id;

      Vue.nextTick(async () => {
        if (this.productdetail.product.selectCategory.indexOf(mainId) == -1) {
          this.productdetail.product.selectCategory.push(mainId);
        }

        for (const data of this.productdetail.product.selectCategory) {
          for (let i = firstId; i <= lastId; i++) {
            if (data == i) {
              arrayFlag = true;
            }
          }
        }
        if (!arrayFlag) {
          var index = this.productdetail.product.selectCategory.indexOf(mainId);
          this.productdetail.product.selectCategory.splice(index, mainId);
        }
      });
    },
    checkSubCategoryLevel2checked: function (index, index2, val, mainId, root) {
      let arrayFlag = false;
      let length = this.categorys[index].categoryList[index2].categoryList
        .length;
      let firstId = this.categorys[index].categoryList[index2].categoryList[0]
        .id;
      let lastId = this.categorys[index].categoryList[index2].categoryList[
        length - 1
      ].id;

      Vue.nextTick(async () => {
        if (this.productdetail.product.selectCategory.indexOf(mainId) == -1) {
          this.productdetail.product.selectCategory.push(mainId);
        }

        if (this.productdetail.product.selectCategory.indexOf(root) == -1) {
          this.productdetail.product.selectCategory.push(root);
        }

        for (const data of this.productdetail.product.selectCategory) {
          for (let i = firstId; i <= lastId; i++) {
            if (data == i) {
              arrayFlag = true;
            }
          }
        }
        if (!arrayFlag) {
          var index = this.productdetail.product.selectCategory.indexOf(mainId);
          this.productdetail.product.selectCategory.splice(index, mainId);
          var index2 = this.productdetail.product.selectCategory.indexOf(root);
          this.productdetail.product.selectCategory.splice(index2, root);
        }
      });
    },
    deleteData: async function () {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/product/removeProductDetail/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/product";
        }
      }
    },
  },
};
</script>

<style scoped>
.store-type-box {
  border: 1px solid #bcbcbc;
  height: 300px;
  overflow-y: auto;
}

.view-txt {
  position: absolute;
  right: 0;
  top: 0;
  text-decoration: underline;
  color: #707070;
  z-index: 1;
}

.parent-cat {
  display: inline-block;
  position: relative;
  top: 5px;
  margin-left: 10px;
}

.pl-lv4-cb {
  margin-left: 55px;
}
</style>