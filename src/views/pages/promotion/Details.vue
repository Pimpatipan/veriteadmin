<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Promotion Details</h1>
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
                    v-model="form.promotion.isSameLanguage"
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
                  :disabled="form.promotion.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div v-for="(item, index) in form.promotion.translationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <InputText
                      textFloat="Name"
                      placeholder="Name"
                      type="text"
                      name="name"
                      isRequired
                      v-model="item.name"
                      :img="imageLogoLang"
                      :isValidate="$v.form.promotion.translationList.$each.$iter[index].name.$error"
                      :v="$v.form.promotion.translationList.$each.$iter[index].name"
                    />
                  </div>
                </div>
              </b-col>
              <b-col md="6">
                <InputSelect
                  title="Type"
                  name="type"
                  isRequired
                  v-model="form.promotion.promotionTypeId"
                  v-bind:options="typelist"
                  valueField="id"
                  textField="name"
                  @onDataChange="handleChangePromotionType"
                  :disabled="isEdit"
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
                  isRequired
                  v-model="form.promotion.sortOrder"
                  @onKeypress="isNumber($event)"
                  :isValidate="$v.form.promotion.sortOrder.$error"
                  :v="$v.form.promotion.sortOrder"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <label class="font-weight-bold label-text">
                  User Group
                  <span class="text-danger">*</span>
                </label>

                <div class="store-type-box px-4 mb-2">
                  <b-form-radio
                    v-model="form.promotion.memberType"
                    size="lg"
                    class="my-2 radios"
                    v-for="(item,index) in userGroupList"
                    v-bind:key="index"
                    name="some-radios"
                    :value="item.id"
                  >{{item.name}}</b-form-radio>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <label class="label-text">
                  Valid From
                  <span class="text-danger">*</span>
                </label>
                <datetime
                  placeholder="Please select date"
                  class="date-picker"
                  v-model="form.promotion.startDate"
                  format="dd/MM/yyyy"
                  value-zone="local"
                ></datetime>
                <p
                  class="text-danger"
                  v-if="error"
                >The Valid from date must be earlier than end date</p>
              </b-col>
              <b-col md="6">
                <label class="label-text">
                  Valid To
                  <span class="text-danger">*</span>
                </label>
                <datetime
                  placeholder="Please select date"
                  class="date-picker"
                  v-model="form.promotion.endDate"
                  format="dd/MM/yyyy"
                  value-zone="local"
                ></datetime>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox
                    size="lg"
                    id="showQuantity"
                    class="mt-3"
                    v-model="form.promotion.useQuantity"
                  >Show Quantity</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row v-if="form.promotion.useQuantity" class="mt-3">
              <b-col md="6">
                <InputText
                  textFloat="Quantity"
                  placeholder="Quantity"
                  type="text"
                  name="quantity"
                  isRequired
                  v-model="form.promotion.quantity"
                  @onKeypress="isNumber($event)"
                  :isValidate="$v.form.promotion.quantity.$error"
                  :v="$v.form.promotion.quantity"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox
                    size="lg"
                    id="coupon"
                    class="mt-3"
                    v-model="form.promotion.isCouponCode"
                  >Coupon</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row v-if="form.promotion.isCouponCode" class="mt-3">
              <b-col cols="6">
                <InputText
                  textFloat="Coupon Code"
                  placeholder="Coupon Code"
                  type="text"
                  name="code"
                  isRequired
                  v-model="form.promotion.couponCode"
                  :isValidate="$v.form.promotion.couponCode.$error"
                  :v="$v.form.promotion.couponCode"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Use per customer"
                  placeholder="Use per customer"
                  type="text"
                  name="usepercustomer"
                  isRequired
                  v-model="form.promotion.maxUsedPerPerson"
                  @onKeypress="isNumber($event)"
                  :isValidate="$v.form.promotion.maxUsedPerPerson.$error"
                  :v="$v.form.promotion.maxUsedPerPerson"
                  v-if="form.promotion.memberType == 4"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox
                    size="lg"
                    id="sequence"
                    class="mt-3"
                    v-model="form.promotion.stopSequence"
                  >Stop Sequence</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="6">
                <label class="font-weight-bold main-label">
                  Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="form.promotion.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span
                      class="ml-2 main-label"
                    >{{form.promotion.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <HeaderLine text="Condition" class="my-4" />

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Minimum Amount (ฺBaht)"
                  placeholder="Minimum Amount (ฺBaht)"
                  isRequired
                  type="text"
                  name="minimum"
                  v-model="form.minimumAmount.amount"
                  @onKeypress="isNumber($event)"
                  :isValidate="$v.form.minimumAmount.amount.$error"
                  :v="$v.form.minimumAmount.amount"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox
                    size="lg"
                    id="skipcondistion"
                    class="mt-2 mb-3"
                    v-model="form.condition.skipPromotionPrice"
                  >Skip Advance Price</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox
                    size="lg"
                    id="cartcondition"
                    class="mt-1 mb-3"
                    v-model="form.promotion.checkCartCondition"
                  >Skip Discount Product</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col xl="6" lg="8">
                <label class="label-text">Condition Scope</label>
                <b-row>
                  <b-col>
                    <InputText
                      textFloat="Number of X Product"
                      placeholder="Number of X Product"
                      type="text"
                      name="xproduct"
                      @onKeypress="isNumber($event)"
                      isRequired
                      class="mt-3"
                      v-model="form.condition.minimumPrice"
                      :isValidate="$v.form.condition.minimumPrice.$error"
                      :v="$v.form.condition.minimumPrice"
                    />

                    <InputSelect
                      class="condition-type float-left p-0"
                      name="type"
                      isRequired
                      v-model="form.condition.promotionConditionScope.promotionScopeTypeId"
                      v-bind:options="conditionScopeList"
                      valueField="id"
                      textField="name"
                      @onDataChange="handleChangeConditionScope"
                    />
                    <InputSelect
                      v-if="form.condition.promotionConditionScope.promotionScopeTypeId != 0"
                      class="condition-type float-left"
                      name="type"
                      isRequired
                      v-model="form.condition.promotionConditionScope.conditionOperationTypeId"
                      v-bind:options="conditionTypeList"
                      valueField="id"
                      textField="name"
                      @onDataChange="handleChangenOperation"
                    />
                    <div class="mt-2 float-left">
                      <span
                        class="text-underline select-txt float-left"
                        v-if="form.condition.promotionConditionScope.promotionScopeTypeId != 0"
                        @click="addProductoCategory"
                      >Select</span>
                    </div>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <div>
              <p
                v-if="isCategory"
                class="font-weight-bold"
              >{{form.condition.promotionConditionScope.categoryNameList.toString()}}</p>
              <p
                v-if="isProduct"
                class="font-weight-bold"
              >{{form.condition.promotionConditionScope.productNameList.toString()}}</p>
              <p
                v-if="$v.form.condition.promotionConditionScope.productOrCategoryList.$error"
                class="text-danger mt-0"
              >Please select at least one category/product</p>
            </div>

            <b-row v-if="showCategoryList">
              <b-col xl="6" lg="8">
                <div class="store-type-box px-4 mb-4 category-box">
                  <CategoryList
                    :items="categorys"
                    :parentList="parentList"
                    section="condition"
                    :dataList="form.condition.promotionConditionScope.productOrCategoryList"
                    @handleAddRootCategory="addRootCategory"
                    @handleAddCategory="addCategory"
                    @handleAddCategoryLevel2="addCategoryLevel2"
                  />
                </div>
                <div>
                  <b-button
                    class="btn-details-set ml-0"
                    @click="showCategoryList = !showCategoryList"
                  >CLOSE</b-button>
                </div>
              </b-col>
            </b-row>

            <div v-if="showProductList">
              <ProductList
                section="condition"
                @getProductList="getProductList"
                @addProductName="addProductName"
                :productlist="productlist"
                :rows="rows"
                :isBusy="isBusy"
                :idList="form.condition.promotionConditionScope.productOrCategoryList"
                @handleChangePagination="pagination"
                @handleChangePerpage="hanndleChangePerpage"
                @handleSearch="handleSearch"
              />

              <div class="mt-5">
                <b-button
                  class="btn-details-set ml-0"
                  @click="showProductList = !showProductList"
                >CLOSE</b-button>
              </div>
            </div>

            <HeaderLine text="Action" class="my-4" />

            <b-row v-if="form.promotion.promotionTypeId != 5">
              <b-col md="6">
                <InputText
                  :textFloat="`Discount (${this.promotionType})`"
                  :placeholder="`Discount (${this.promotionType})`"
                  type="text"
                  name="discountbaht"
                  v-model="form.privilage.minimumPrice"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col md="6">
                <InputText
                  textFloat="Number of Y Product"
                  placeholder="Number of Y Product"
                  type="text"
                  name="xproduct"
                  v-model="form.privilage.minimumPrice"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>

            <HeaderLine text="Applied" class="my-4" />

            <b-row v-if="form.promotion.promotionTypeId != 5">
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox
                    size="lg"
                    id="condition"
                    v-model="form.promotion.useSameCondition"
                  >Use same as Conditions</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row v-if="form.promotion.promotionTypeId != 5">
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox
                    size="lg"
                    id="skipprivilage"
                    class="mt-2"
                    v-model="form.privilage.skipPromotionPrice"
                  >Skip Advance Price</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <div v-if="!form.promotion.useSameCondition" class="mt-3">
              <b-row v-if="form.promotion.promotionTypeId != 5">
                <b-col xl="6" lg="8">
                  <label class="label-text">Condition Scope</label>
                  <b-row>
                    <b-col>
                      <InputSelect
                        class="condition-type float-left p-0"
                        name="type"
                        isRequired
                        v-model="form.privilage.promotionConditionScope.promotionScopeTypeId"
                        v-bind:options="conditionScopeList"
                        valueField="id"
                        textField="name"
                        @onDataChange="handleChangeConditionScopeApplied"
                      />
                      <InputSelect
                        v-if="form.privilage.promotionConditionScope.promotionScopeTypeId != 0"
                        class="condition-type float-left"
                        name="type"
                        isRequired
                        v-model="form.privilage.promotionConditionScope.conditionOperationTypeId"
                        v-bind:options="conditionTypeList"
                        valueField="id"
                        textField="name"
                        @onDataChange="handleChangenOperationApplied"
                      />
                      <div class="mt-2">
                        <span
                          class="text-underline select-txt"
                          v-if="form.privilage.promotionConditionScope.promotionScopeTypeId != 0"
                          @click="addProductoCategoryApplied"
                        >Select</span>
                      </div>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <div>
                <p
                  v-if="isCategoryApplied"
                  class="font-weight-bold"
                >{{form.privilage.promotionConditionScope.categoryNameList.toString()}}</p>
                <p
                  v-if="isProductApplied"
                  class="font-weight-bold"
                >{{form.privilage.promotionConditionScope.productNameList.toString()}}</p>
                <div v-if="showBuyXGetYProductList" class="mb-3">
                  <span class="font-weight-bold">{{comma(form.appliedProduct)}}</span>
                </div>
                <p
                  v-if="$v.form.privilage.promotionConditionScope.productOrCategoryList.$error"
                  class="text-danger mt-0"
                >Please select at least one category/product</p>
              </div>

              <b-row v-if="showCategoryListApplied">
                <b-col xl="6" lg="8">
                  <div class="store-type-box px-4 mb-4 category-box">
                    <CategoryList
                      :items="categorys"
                      :parentList="parentList"
                      section="privilage"
                      :dataList="form.privilage.promotionConditionScope.productOrCategoryList"
                      @handleAddRootCategory="addRootCategory"
                      @handleAddCategory="addCategory"
                      @handleAddCategoryLevel2="addCategoryLevel2"
                    />
                  </div>
                  <div>
                    <b-button
                      class="btn-details-set ml-0 ml-sm-2"
                      @click="showCategoryListApplied = !showCategoryListApplied"
                    >CLOSE</b-button>
                  </div>
                </b-col>
              </b-row>

              <div v-if="showProductListApplied">
                <ProductList
                  section="privilage"
                  @getProductList="getProductListApplied"
                  @addProductName="addProductName"
                  :productlist="productlistapplied"
                  :rows="rowsApplied"
                  :isBusy="isBusyApplied"
                  :idList="form.privilage.promotionConditionScope.productOrCategoryList"
                  @handleChangePagination="paginationApplied"
                  @handleChangePerpage="hanndleChangePerpageApplied"
                  @handleSearch="handleSearchApplied"
                />

                <div class="mt-5" v-if="form.promotion.promotionTypeId != 5">
                  <b-button
                    class="btn-details-set ml-0 ml-sm-2"
                    @click="showProductListApplied = !showProductListApplied"
                  >CLOSE</b-button>
                </div>
              </div>

              <b-row v-if="showBuyXGetYProductList">
                <b-col class="w-100">
                  <b-row class="mb-3">
                    <b-col md="6">
                      <b-input-group class="panel-input-serach">
                        <b-form-input
                          class="input-serach"
                          placeholder="Name, SKU"
                          @keyup="handleSearchBuyXGetYModal"
                          v-model="filterBuyXGetY.search"
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
                        class="mt-3 ml-1"
                        v-model="isProductInCategoryBuyXGetY"
                        @change="handleChangeIsProductInCategoryBuyXGetY"
                      >Show only product in this promotion</b-form-checkbox>
                    </b-col>
                  </b-row>

                  <b-table
                    responsive
                    striped
                    :fields="buyXgetYfields"
                    :items="buyXgetYProductList"
                    :busy="isBusybuyXgetY"
                    show-empty
                    empty-text="No matching records found"
                  >
                    <template v-slot:cell(id)="data">
                      <b-form-checkbox
                        size="lg"
                        class="ml-3"
                        :value="data.item.id"
                        v-model="buyXgetYProductSelectedIdList"
                        @change="addBuyXGetYSelectedProduct(data.item)"
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
                      <div>
                        <p class="m-0">{{ data.item.price | numeral('0,0.00') }}</p>
                      </div>
                    </template>
                    <template v-slot:cell(quantity)="data">
                      <b-form-input
                        v-model="data.item.quantity"
                        class="quantity"
                        @keypress="isNumber($event)"
                        @change="handleChangeQuantity(data.item.id,data.index,data.item.quantity)"
                      />
                    </template>
                    <template v-slot:cell(isApply)="data">
                      <b-form-checkbox
                        size="lg"
                        class="ml-3"
                        v-model="data.item.isApply"
                        @change="handleChangeisApplied(data.item.id,data.index,data.item.isApply)"
                      ></b-form-checkbox>
                    </template>
                    <template v-slot:table-busy>
                      <div class="text-center text-black my-2">
                        <b-spinner class="align-middle"></b-spinner>
                        <strong class="ml-2">Loading...</strong>
                      </div>
                    </template>
                  </b-table>

                  <b-row>
                    <b-col class="form-inline justify-content-center justify-content-md-between">
                      <b-pagination
                        v-model="filterBuyXGetY.pageNo"
                        :total-rows="rowsbuyXgetY"
                        :per-page="filterBuyXGetY.perPage"
                        class="m-md-0"
                        @change="paginationProduct"
                      ></b-pagination>
                      <b-form-select
                        v-model="filterBuyXGetY.perPage"
                        @change="hanndleChangePerpageProduct"
                        :options="pageOptions"
                      ></b-form-select>
                    </b-col>
                  </b-row>

                  <p
                    class="text-danger mt-3"
                    v-if="form.appliedProduct.length == 0"
                  >Please select at least one product</p>

                  <p
                    class="text-danger mt-3"
                    v-if="$v.form.appliedProduct.$each.$error"
                  >The quantity must greater than 1</p>

                  <!-- <pre>{{$v.form.appliedProduct}}</pre> -->

                  <p
                    class="text-danger mt-3"
                    v-if="errorBuyXGetY"
                  >The number of applied product must equals to number of X product (Action)</p>
                </b-col>
              </b-row>
            </div>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button
                  class="btn btn-danger btn-details-set mr-md-2"
                  v-if="isEdit"
                  @click="deleteData()"
                  :disabled="isDisable"
                >REMOVE</b-button>
                <b-button href="/promotion" class="btn-details-set" :disabled="isDisable">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  :disabled="isDisable"
                  @click="checkForm(0)"
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
import InputSelect from "@/components/inputs/InputSelect";
import HeaderLine from "@/components/HeaderLine";
import Vue from "vue";
import { required, requiredIf, minValue } from "vuelidate/lib/validators";
import * as moment from "moment/moment";
import ModalAlert from "@/components/ModalAlert";
import CategoryList from "./components/CategoryList";
import ProductList from "@/components/product/ProductList";

export default {
  name: "PromotionDetails",
  components: {
    InputText,
    InputSelect,
    HeaderLine,
    ModalAlert,
    CategoryList,
    ProductList,
  },
  data() {
    return {
      id: this.$route.params.id,
      isLoadingData: false,
      isDisable: false,
      error: false,
      init: true,
      errorBuyXGetY: false,
      modalAlertShow: false,
      parentList: [],
      languageList: [],
      imageLogoLang: "",
      languageActive: 1,
      categoryListSelected: [],
      categoryListSelectedId: [],
      categoryListSelectedApplied: [],
      categoryListSelectedIdApplied: [],
      buyXgetYIdSelected: [],
      categorys: [
        {
          categoryList: [],
        },
      ],
      promotionType: "",
      existId: "",
      isInit: true,
      setQuantity: false,
      isLoading: false,
      isSameCondition: false,
      isProductInCategory: true,
      isProductInCategoryApplied: true,
      isProductInCategoryBuyXGetY: true,
      hasCoupon: false,
      isEdit: false,
      isBusy: false,
      isBusyApplied: false,
      isBusybuyXgetY: false,
      isCategory: false,
      isProduct: false,
      showProductList: false,
      showCategoryList: false,
      isCategoryApplied: false,
      isProductApplied: false,
      showProductListApplied: false,
      showCategoryListApplied: false,
      showBuyXGetYProductList: false,
      selected: 1,
      rows: 0,
      rowsApplied: 0,
      rowsbuyXgetY: 0,
      productlist: [],
      productlistapplied: [],
      buyXgetYProductList: [],
      buyXgetYProductSelectedList: [],
      buyXgetYProductSelectedIdList: [],
      buyXgetYProductIsApplyIdList: [],
      buyXgetYProductNameIdList: [],
      typelist: [],
      conditionScopeList: [],
      conditionTypeList: [
        { id: 1, name: "Include" },
        { id: 2, name: "Except" },
      ],
      userGroupList: [],
      fields: [
        {
          key: "id",
          label: "",
        },
        {
          key: "imageUrl",
          label: "Thumbnail",
          class: "w-100px",
        },
        {
          key: "name",
          label: "Name",
          class: "w-200",
          tdClass: "text-left",
        },
        {
          key: "sku",
          label: "SKU",
          class: "w-100px",
        },
        {
          key: "price",
          label: "Price",
          class: "w-100px",
        },
      ],
      buyXgetYfields: [
        {
          key: "id",
          label: "",
        },
        {
          key: "isApply",
          label: "Complimentary",
        },
        {
          key: "imageUrl",
          label: "Thumbnail",
          class: "w-100px",
        },
        {
          key: "name",
          label: "Name",
          class: "w-100px",
          tdClass: "text-left",
        },
        {
          key: "sku",
          label: "SKU",
        },
        {
          key: "price",
          label: "Price",
          class: "w-100px",
        },
        {
          key: "quantity",
          label: "Quantity",
        },
      ],
      filter: {
        perPage: 5,
        pageNo: 1,
        search: "",
        isProductInCategory: true,
        productIdList: [],
      },
      filterapplied: {
        perPage: 5,
        pageNo: 1,
        search: "",
        isProductInCategory: true,
        productIdList: [],
      },
      filterBuyXGetY: {
        perPage: 5,
        pageNo: 1,
        search: "",
        isProductInPromotion: 0,
        selectProductList: [],
      },
      pageOptions: [
        { value: 5, text: "5 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" },
      ],
      form: {
        promotion: {
          id: 0,
          sortOrder: 0,
          stopSequence: false,
          checkCartCondition: false,
          startDate: "",
          endDate: "",
          isCouponCode: false,
          couponCode: null,
          couponQuantity: 0,
          maxUsedPerPerson: 0,
          promotionTypeId: 0,
          quantity: 0,
          memberType: 0,
          enabled: false,
          useSameCondition: false,
          mainLanguageId: 1,
          isSameLanguage: true,
          useQuantity: false,
          translationList: [
            {
              languageId: 1,
              name: null,
            },
            {
              languageId: 2,
              name: null,
            },
          ],
        },
        condition: {
          id: 0,
          minimumTypeId: 0,
          minimumPrice: 0,
          skipPromotionPrice: false,
          promotionConditionScope: {
            promotionScopeTypeId: 0,
            conditionOperationTypeId: 0,
            productOrCategoryList: [],
            productNameList: [],
            categoryNameList: [],
          },
        },
        privilage: {
          id: 0,
          minimumTypeId: 0,
          minimumPrice: 0,
          skipPromotionPrice: false,
          promotionConditionScope: {
            promotionScopeTypeId: 0,
            conditionOperationTypeId: 0,
            productOrCategoryList: [],
            productNameList: [],
            categoryNameList: [],
          },
        },
        minimumAmount: {
          id: 0,
          amount: 0,
        },
        appliedProduct: [],
      },
    };
  },
  validations: {
    form: {
      promotion: {
        sortOrder: { required },
        couponCode: {
          required: requiredIf(function () {
            return this.form.promotion.isCouponCode;
          }),
        },
        quantity: {
          required: requiredIf(function () {
            return this.form.promotion.useQuantity;
          }),
        },
        maxUsedPerPerson: {
          required: requiredIf(function () {
            return (
              this.form.promotion.isCouponCode &&
              this.form.promotion.memberType == 4
            );
          }),
        },
        translationList: {
          $each: {
            name: { required },
          },
        },
      },
      condition: {
        minimumPrice: {
          required: requiredIf(function () {
            return (
              this.form.condition.promotionConditionScope
                .promotionScopeTypeId != 0 &&
              this.form.promotion.promotionTypeId == 5
            );
          }),
        },
        promotionConditionScope: {
          productOrCategoryList: {
            required: requiredIf(function () {
              return (
                this.form.condition.promotionConditionScope
                  .productOrCategoryList != [] &&
                this.form.condition.promotionConditionScope
                  .promotionScopeTypeId != 0
              );
            }),
          },
        },
      },
      privilage: {
        minimumPrice: { required },
        promotionConditionScope: {
          productOrCategoryList: {
            required: requiredIf(function () {
              return (
                this.form.privilage.promotionConditionScope
                  .productOrCategoryList != [] &&
                this.form.privilage.promotionConditionScope
                  .promotionScopeTypeId != 0
              );
            }),
          },
        },
      },
      minimumAmount: {
        amount: { required },
      },
      appliedProduct: {
        required: requiredIf(function () {
          return (
            this.form.promotion.promotionTypeId == 5 &&
            this.form.appliedProduct.length == []
          );
        }),
        $each: {
          quantity: { required, minValue: minValue(1) },
        },
      },
    },
  },
  created: async function () {
    await this.getDatas();
  },
  methods: {
    moment: function () {
      return moment();
    },
    comma(array) {
      let str = "";
      for (let i = 0; i < this.form.appliedProduct.length; i++) {
        if (array[i].isApply == true) {
          str +=
            array[i].name +
            " (" +
            array[i].quantity +
            ") (Complimentary) " +
            " , ";
        } else {
          str += array[i].name + " (" + array[i].quantity + ") " + " , ";
        }
      }
      str = str.replace(/,\s*$/, "");
      return str;
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
    handleCloseModal: function () {
      if (this.flag == 1) {
        window.location.href = "/promotion";
      } else {
        if (this.id > 0) {
          this.init = true;
          this.getDatas();
        } else {
          this.form.promotion.id = this.existId;
          this.id = this.existId;
          this.isEdit = true;

          this.$router.push({ path: `/promotion/details/${this.existId}` });
        }
      }
    },
    handleChangeConditionScope(value) {
      this.form.condition.promotionConditionScope.promotionScopeTypeId = value;
      this.showProductList = false;
      this.showCategoryList = false;

      console.log(this.init);

      if (!this.init) {
        this.form.condition.promotionConditionScope.productOrCategoryList = [];
        this.form.condition.promotionConditionScope.productNameList = [];
        this.form.condition.promotionConditionScope.categoryNameList = [];
      }

      if (
        this.form.condition.promotionConditionScope.promotionScopeTypeId == 1
      ) {
        this.isProduct = true;
        this.isCategory = false;
      } else {
        this.isCategory = true;
        this.isProduct = false;
      }
    },
    handleChangeConditionScopeApplied(value) {
      this.form.privilage.promotionConditionScope.promotionScopeTypeId = value;
      this.showProductListApplied = false;
      this.showCategoryListApplied = false;

      if (!this.init) {
        this.form.privilage.promotionConditionScope.productOrCategoryList = [];
        this.form.privilage.promotionConditionScope.productNameList = [];
        this.form.privilage.promotionConditionScope.categoryNameList = [];
      }

      if (
        this.form.privilage.promotionConditionScope.promotionScopeTypeId == 1
      ) {
        this.isProductApplied = true;
        this.isCategoryApplied = false;
      } else {
        this.isCategoryApplied = true;
        this.isProductApplied = false;
      }
    },
    handleChangePromotionType(value) {
      this.form.promotion.promotionTypeId = value;

      if (value == 3) {
        this.promotionType = "Baht";
      } else {
        this.promotionType = "Percent";
      }

      if (value == 5) {
        this.isSameCondition = false;
        this.showBuyXGetYProductList = true;
        this.isProductApplied = false;
        this.getBuyXGetYProduct();
      } else {
        this.isSameCondition = true;
        this.showBuyXGetYProductList = false;
      }

      if (
        this.form.privilage.promotionConditionScope.promotionScopeTypeId == 1 &&
        this.form.promotion.promotionTypeId != 5
      ) {
        this.isProductApplied = true;
      } else {
        this.isProductApplied = false;
      }
    },
    handleChangenOperation(value) {
      this.form.condition.promotionConditionScope.conditionOperationTypeId = value;
    },
    handleChangenOperationApplied(value) {
      this.form.privilage.promotionConditionScope.conditionOperationTypeId = value;
    },
    getDatas: async function () {
      this.isLoadingData = true;
      this.isProductInCategoryBuyXGetY = true;
      this.errorBuyXGetY = false;

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

      if (this.selected == 1) {
        this.promotionType = "Baht";
      }

      let usergroup = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/promotion/userGroup`,
        null,
        this.$headers,
        null
      );

      if (usergroup.result == 1) {
        this.userGroupList = usergroup.detail;
      }

      let type = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/promotion/promotionType`,
        null,
        this.$headers,
        null
      );

      if (type.result == 1) {
        this.typelist = type.detail;
      }

      let scope = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/promotion/PromotionScopeType`,
        null,
        this.$headers,
        null
      );

      if (scope.result == 1) {
        this.conditionScopeList = scope.detail;
      }

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/promotion/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;

        if (this.form.promotion.isSameLanguage) {
          this.imageLogoLang = "";
        } else {
          var index = this.languageList
            .map(function (x) {
              return x.id;
            })
            .indexOf(this.languageActive);
          this.imageLogoLang = this.languageList[index].imageUrl;
        }

        if (this.id > 0) {
          this.isEdit = true;
          this.handleChangeConditionScope(
            this.form.condition.promotionConditionScope.promotionScopeTypeId
          );
          this.handleChangeConditionScopeApplied(
            this.form.privilage.promotionConditionScope.promotionScopeTypeId
          );
          this.handleChangePromotionType(this.form.promotion.promotionTypeId);
          if (
            this.form.condition.promotionConditionScope
              .conditionOperationTypeId == 0
          ) {
            this.form.condition.promotionConditionScope.conditionOperationTypeId = 1;
          }

          if (
            this.form.privilage.promotionConditionScope
              .conditionOperationTypeId == 0
          ) {
            this.form.privilage.promotionConditionScope.conditionOperationTypeId = 1;
          }

          this.init = false;
        } else {
          this.form.promotion.promotionTypeId = 3;
          this.form.promotion.memberType = 1;
          this.form.condition.minimumTypeId = 1;
          this.form.privilage.minimumTypeId = 1;
          this.form.condition.promotionConditionScope.conditionOperationTypeId = 1;
          this.form.privilage.promotionConditionScope.conditionOperationTypeId = 1;
          this.form.promotion.startDate = moment().format();
          this.form.promotion.endDate = moment().format();
          this.init = false;
        }
      }
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    useSameLanguage: async function () {
      Vue.nextTick(() => {
        if (this.form.promotion.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.promotion.mainLanguageId = this.languageActive;
          let data = this.form.promotion.translationList.filter(
            (val) => val.languageId == this.form.promotion.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.promotion.translationList.length;
                index++
              ) {
                this.form.promotion.translationList[index].name = data.name;
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
          let data = this.form.promotion.translationList.filter(
            (val) => val.languageId != this.form.promotion.mainLanguageId
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
    checkValidateTranslationList: async function () {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (
            this.$v.form.promotion.translationList.$each.$iter[index].$error
          ) {
            this.languageActive = this.$v.form.promotion.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    getBuyXGetYProduct: async function () {
      this.isBusybuyXgetY = true;

      Vue.nextTick(() => {
        if (this.isProductInCategoryBuyXGetY == true) {
          this.filterBuyXGetY.isProductInPromotion = true;
        } else {
          this.filterBuyXGetY.isProductInPromotion = false;
        }
      });

      this.filterBuyXGetY.selectProductList = this.form.appliedProduct;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/promotion/getProductPromotion`,
        null,
        this.$headers,
        this.filterBuyXGetY
      );
      if (data.result == 1) {
        this.buyXgetYProductList = data.detail.dataList;
        this.rowsbuyXgetY = data.detail.count;
        this.isBusybuyXgetY = false;

        if (this.isInit) {
          if (this.form.appliedProduct.length != 0) {
            this.buyXgetYProductSelectedIdList = [];

            for (const idList of this.form.appliedProduct) {
              this.buyXgetYProductSelectedIdList.push(idList.id);

              let data = this.buyXgetYProductList.filter(
                (val) => val.id == idList.id
              );
              this.buyXgetYProductNameIdList.push(data[0].name);
            }
          }
        }

        this.isInit = false;
      }
    },
    getProductList: async function (value, page) {
      this.isBusy = true;

      if (page != null && this.filter.pageNo != 1) {
        this.filter.pageNo = 1;
      }

      if (value == true || value == null) {
        this.filter.isProductInCategory = true;
      } else {
        this.filter.isProductInCategory = false;
      }

      this.filter.productIdList = [];

      await this.form.condition.promotionConditionScope.productOrCategoryList.forEach(
        (element, index) => {
          this.filter.productIdList.push(element);
        }
      );

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
      }
    },
    getProductListApplied: async function (value, page) {
      this.isBusyApplied = true;

      if (page != null && this.filterapplied.pageNo != 1) {
        this.filterapplied.pageNo = 1;
      }

      if (value == true || value == null) {
        this.filterapplied.isProductInCategory = true;
      } else {
        this.filterapplied.isProductInCategory = false;
      }

      this.filterapplied.productIdList = [];

      await this.form.privilage.promotionConditionScope.productOrCategoryList.forEach(
        (element, index) => {
          this.filterapplied.productIdList.push(element);
        }
      );

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/category/getProductList`,
        null,
        this.$headers,
        this.filterapplied
      );
      if (data.result == 1) {
        this.productlistapplied = data.detail.dataList;
        this.rowsApplied = data.detail.count;
        this.isBusyApplied = false;

        //temp for buy x get x product list
        // this.buyXgetYProductList = data.detail.dataList;
        // this.rowsbuyXgetY = data.detail.count;
        // this.isBusybuyXgetY = false;
      }
    },
    addParent(ref) {
      this.parentList.push(ref);
    },
    deleteParent(ref) {
      var index = this.parentList.indexOf(ref);
      if (index !== -1) this.parentList.splice(index, 1);
    },
    addRootCategory(id, name, section, list) {
      var sectionName = section;

      this.form[
        sectionName
      ].promotionConditionScope.productOrCategoryList = list;

      var index = this.form[
        sectionName
      ].promotionConditionScope.categoryNameList.indexOf(name);
      if (index != -1)
        this.form[sectionName].promotionConditionScope.categoryNameList.splice(
          index,
          1
        );
      else
        this.form[sectionName].promotionConditionScope.categoryNameList.push(
          name
        );
    },
    addCategory: function (name, indexRoot, mainId, rootname, section, list) {
      var sectionName = section;
      let arrayFlag = false;
      let length = this.categorys[indexRoot].categoryList.length;
      let firstId = this.categorys[indexRoot].categoryList[0].id;
      let lastId = this.categorys[indexRoot].categoryList[length - 1].id;

      this.form[
        sectionName
      ].promotionConditionScope.productOrCategoryList = list;

      Vue.nextTick(async () => {
        if (
          this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.indexOf(mainId) == -1
        ) {
          this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.push(mainId);
        }

        if (
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(rootname) == -1
        ) {
          this.form[sectionName].promotionConditionScope.categoryNameList.push(
            rootname
          );
        }

        if (
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(name) == -1
        ) {
          this.form[sectionName].promotionConditionScope.categoryNameList.push(
            name
          );
        } else {
          var nameindex = this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(name);
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.splice(nameindex, 1);
        }

        let sublistMenu = this.categorys[indexRoot].categoryList;

        for (const data of this.form[sectionName].promotionConditionScope
          .productOrCategoryList) {
          for (let i = 0; i < sublistMenu.length; i++) {
            if (data == sublistMenu[i].id) {
              arrayFlag = true;
            }
          }
        }

        if (!arrayFlag) {
          var index = this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.indexOf(mainId);
          this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.splice(index, mainId);
          var indexname = this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(rootname);
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.splice(indexname, 1);
        }
      });
    },
    addCategoryLevel2: function (
      indexRoot,
      indexMain,
      rootId,
      mainId,
      rootCatName,
      mainCatname,
      name,
      section,
      list
    ) {
      var sectionName = section;
      let arrayFlag = false;
      let length = this.categorys[indexRoot].categoryList[indexMain]
        .categoryList.length;
      let firstId = this.categorys[indexRoot].categoryList[indexMain]
        .categoryList[0].id;
      let lastId = this.categorys[indexRoot].categoryList[indexMain]
        .categoryList[length - 1].id;

      this.form[
        sectionName
      ].promotionConditionScope.productOrCategoryList = list;

      Vue.nextTick(async () => {
        if (
          this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.indexOf(mainId) == -1
        ) {
          this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.push(mainId);
        }

        if (
          this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.indexOf(rootId) == -1
        ) {
          this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.push(rootId);
        }

        if (
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(rootCatName) == -1
        ) {
          this.form[sectionName].promotionConditionScope.categoryNameList.push(
            rootCatName
          );
        }

        if (
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(mainCatname) == -1
        ) {
          this.form[sectionName].promotionConditionScope.categoryNameList.push(
            mainCatname
          );
        }

        if (
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(name) == -1
        ) {
          this.form[sectionName].promotionConditionScope.categoryNameList.push(
            name
          );
        } else {
          var nameindex = this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(name);
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.splice(nameindex, 1);
        }

        for (const data of this.form[sectionName].promotionConditionScope
          .productOrCategoryList) {
          for (let i = firstId; i <= lastId; i++) {
            if (data == i) {
              arrayFlag = true;
            }
          }
        }
        if (!arrayFlag) {
          var index = this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.indexOf(mainId);
          this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.splice(index, mainId);
          var index2 = this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.indexOf(rootId);
          this.form[
            sectionName
          ].promotionConditionScope.productOrCategoryList.splice(
            index2,
            rootId
          );

          var indexnamesub = this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(mainCatname);
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.splice(indexnamesub, 1);

          var indexname = this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.indexOf(rootCatName);
          this.form[
            sectionName
          ].promotionConditionScope.categoryNameList.splice(indexname, 1);
        }
      });
    },
    addProductName: function (name, list, section) {
      var sectionName = section;

      this.form[
        sectionName
      ].promotionConditionScope.productOrCategoryList = list;

      Vue.nextTick(async () => {
        var index = this.form[
          sectionName
        ].promotionConditionScope.productNameList.indexOf(name);
        if (index != -1)
          this.form[sectionName].promotionConditionScope.productNameList.splice(
            index,
            1
          );
        else
          this.form[sectionName].promotionConditionScope.productNameList.push(
            name
          );
      });
    },
    addProductoCategory() {
      if (
        this.form.condition.promotionConditionScope.promotionScopeTypeId == 1
      ) {
        this.showProductList = true;
        this.filter.isProductInCategory = true;
        this.filter.pageNo = 1;
        this.getProductList(this.filter.isProductInCategory);
      } else {
        this.showCategoryList = true;
      }
    },
    addProductoCategoryApplied() {
      if (
        this.form.privilage.promotionConditionScope.promotionScopeTypeId == 1
      ) {
        this.showProductListApplied = true;
        this.filterapplied.isProductInCategory = true;
        this.filterapplied.pageNo = 1;
        this.getProductListApplied(this.filterapplied.isProductInCategory);
      } else {
        this.showCategoryListApplied = true;
      }
    },
    addBuyXGetYSelectedProduct(data) {
      var index = this.buyXgetYProductSelectedIdList.indexOf(data.id);

      if (index == -1) {
        let productdata = {
          id: data.id,
          name: data.name,
          quantity: data.quantity,
          isApply: data.isApply,
        };
        this.form.appliedProduct.push(productdata);
        this.buyXgetYProductNameIdList.push(data.name);
      } else {
        var index = this.form.appliedProduct
          .map(function (x) {
            return x.id;
          })
          .indexOf(data.id);

        this.form.appliedProduct.splice(index, 1);

        var indexName = this.buyXgetYProductNameIdList.indexOf(data.name);

        this.buyXgetYProductNameIdList.splice(indexName, 1);
      }
    },
    handleChangeQuantity(id, index, quantity) {
      let isApplyData = this.buyXgetYProductList.filter((val) => val.id == id);

      if (id != null) {
        let data = this.form.appliedProduct.filter((val) => val.id == id);
        data[0].quantity = parseInt(isApplyData[0].quantity);
      }
    },
    handleChangeisApplied(id, index, isApply) {
      let isApplyData = this.buyXgetYProductList.filter((val) => val.id == id);

      Vue.nextTick(() => {
        if (id != null) {
          let data = this.form.appliedProduct.filter((val) => val.id == id);
          data[0].isApply = isApplyData[0].isApply;
        }
      });
    },
    pagination(Page) {
      this.filter.pageNo = Page;
      this.getProductList(this.filter.isProductInCategory);
    },
    handleChangeIsProductInCategoryBuyXGetY() {
      this.filterBuyXGetY.pageNo = 1;
      this.getBuyXGetYProduct();
    },
    hanndleChangePerpage(value) {
      this.filter.pageNo = 1;
      this.filter.perpage = value;
      this.getProductList(this.filter.isProductInCategory);
    },
    paginationProduct(Page) {
      this.filterBuyXGetY.pageNo = Page;
      this.getBuyXGetYProduct();
    },
    hanndleChangePerpageProduct(value) {
      this.filterBuyXGetY.pageNo = 1;
      this.filterBuyXGetY.perPage = value;
      this.getBuyXGetYProduct();
    },
    handleSearch(search, value) {
      this.filter.search = search;
      this.filter.pageNo = 1;
      this.getProductList(this.filter.isProductInCategory);
    },
    handleSearchBuyXGetYModal(e) {
      if (e.keyCode === 13) {
        this.filterBuyXGetY.pageNo = 1;
        this.getBuyXGetYProduct();
      }
    },
    paginationApplied(Page) {
      this.filterapplied.pageNo = Page;
      this.getProductListApplied(this.filterapplied.isProductInCategory);
    },
    hanndleChangePerpageApplied(value) {
      this.filterapplied.pageNo = 1;
      this.filterapplied.perpage = value;
      this.getProductListApplied(this.filterapplied.isProductInCategory);
    },
    handleSearchApplied(search, value) {
      this.filterapplied.search = search;
      this.filterapplied.pageNo = 1;
      this.getProductListApplied(this.filterapplied.isProductInCategory);
    },
    checkForm: async function (flag) {
      if (this.form.promotion.isSameLanguage) {
        await this.useSameLanguage();
      }

      this.$v.form.$touch();

      if (this.$v.form.$error) {
        await this.checkValidateTranslationList();
        return;
      }

      if (
        new Date(this.form.promotion.endDate) <
        new Date(this.form.promotion.startDate)
      ) {
        this.error = true;
        return;
      }

      // for check number of x and isapply length

      let data = this.form.appliedProduct.filter((val) => val.isApply == true);

      if (data.length > this.form.privilage.minimumPrice) {
        this.errorBuyXGetY = true;
        return;
      }

      this.error = false;
      this.modalAlertShow = false;
      this.flag = flag;
      this.submit();
    },
    submit: async function () {
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/promotion/save`,
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
        this.msgModal = data.message;
        this.isSuccess = false;
      }

      this.isDisable = false;
    },
    deleteData: async function () {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/promotion/remove/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/promotion";
        }
      }
    },
  },
};
</script>

<style scoped>
.store-type-box {
  border: 1px solid #bcbcbc;
  height: 130px;
  overflow-y: auto;
}

.radios {
  font-size: 16px;
  line-height: 1.9;
}

.select-txt {
  cursor: pointer;
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

.category-box {
  height: 300px;
}

.quantity {
  border: 1px solid #d8dbe0;
  text-align: center;
  width: 100px;
  margin: auto;
}

.quantity:focus {
  border: 1px solid #958bef;
}
</style>