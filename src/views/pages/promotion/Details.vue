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
          <b-col class="px-4 px-sm-5 py-4">
            <b-row>
              <b-col md="6">
                <InputText textFloat="Name" placeholder="Name" type="text" name="name" isRequired />
              </b-col>
              <b-col md="6">
                <InputSelect
                  title="Type"
                  name="type"
                  isRequired
                  v-model="selected"
                  v-bind:options="typelist"
                  valueField="id"
                  textField="name"
                  @onDataChange="handleChangePromotionType"
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
                  @onKeypress="isNumber($event)"
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
                    v-model="userGroupSelected"
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
                <label class="label-text">Valid From</label>
                <datetime placeholder="Please select date" class="date-picker" format="dd/MM/yyyy"></datetime>
              </b-col>
              <b-col md="6">
                <label class="label-text">Valid To</label>
                <datetime placeholder="Please select date" class="date-picker" format="dd/MM/yyyy"></datetime>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox size="lg" id="coupon" class="mt-3" v-model="hasCoupon">Coupon</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row v-if="hasCoupon" class="mt-3">
              <b-col cols="12">
                <InputText
                  textFloat="Coupon Code"
                  placeholder="Coupon Code"
                  type="text"
                  name="code"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Quantity"
                  placeholder="Quantity"
                  type="text"
                  name="quantity"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Use per customer"
                  placeholder="Use per customer"
                  type="text"
                  name="usepercustomer"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox size="lg" id="sequence" class="mt-3">Stop Sequence</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col md="6">
                <label class="font-weight-bold main-label">
                  Status
                  <span class="text-danger">*</span>
                </label>
                <!-- <div>
                  <b-form-checkbox
                    switch
                    v-model="form.bankAccount.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span
                      class="ml-2 main-label"
                    >{{form.bankAccount.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>-->
              </b-col>
            </b-row>

            <HeaderLine text="Condition" class="my-4" />

            <b-row v-if="selected != 3">
              <b-col md="6">
                <InputSelect
                  title="Minimum Type"
                  name="Minimum Type"
                  isRequired
                  v-model="minimumselected"
                  v-bind:options="discountlist"
                  valueField="id"
                  textField="name"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Minimum Amount"
                  placeholder="Minimum Amount"
                  isRequired
                  type="text"
                  name="minimum"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col md="6">
                <InputText
                  textFloat="Number of X Product"
                  placeholder="Number of X Product"
                  type="text"
                  name="xproduct"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox size="lg" id="coupon" class="mt-2 mb-3">Skip Promotion Price</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col xl="6" lg="8">
                <label class="label-text">Condition Scope</label>
                <b-row>
                  <b-col md="6">
                    <div class="mt-2 mt-sm-2 mb-0 float-left">
                      <span v-if="conditionScopeSelected == 1">All</span>
                      <span v-if="conditionScopeSelected == 2">Product</span>
                      <span v-if="conditionScopeSelected == 3">Category</span>
                    </div>
                    <InputSelect
                      v-if="conditionScopeSelected != 1"
                      class="condition-type float-left"
                      name="type"
                      isRequired
                      v-model="conditionTypeSelected"
                      v-bind:options="conditionTypeList"
                      valueField="id"
                      textField="name"
                    />
                    <div class="mt-2">
                      <span
                        class="text-underline select-txt"
                        v-if="conditionScopeSelected != 1"
                        @click="addProductoCategory"
                      >Select</span>
                    </div>
                  </b-col>
                  <b-col md="6">
                    <InputSelect
                      name="type"
                      isRequired
                      v-model="conditionScopeSelected"
                      v-bind:options="conditionScopeList"
                      valueField="id"
                      textField="name"
                      @onDataChange="handleChangeConditionScope"
                    />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <div>
              <p v-if="isCategory">{{categoryListSelected.toString()}}</p>
              <p v-if="isProduct">{{productListSelected.toString()}}</p>
            </div>

            <b-row v-if="showCategoryList">
              <b-col xl="6" lg="8">
                <div class="store-type-box px-4 mb-4 category-box">
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
                              @change="addCategory(item2.id,item2.name)"
                              v-model="categoryListSelectedId"
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
                          <b-form-checkbox
                            size="lg"
                            class="mt-3 ml-5"
                            v-bind:key="key3"
                            :value="item3.id"
                            v-model="categoryListSelectedId"
                            @change="addCategory(item3.id,item3.name)"
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
                    </template>
                  </template>
                </div>
                <div>
                  <button
                    type="button"
                    class="btn btn-success btn-details-set text-uppercase"
                    @click="showCategoryList = !showCategoryList"
                  >Save</button>
                  <b-button
                    class="btn-details-set ml-0 ml-sm-2"
                    @click="showCategoryList = !showCategoryList"
                  >CANCEL</b-button>
                </div>
              </b-col>
            </b-row>

            <b-row v-if="showProductList">
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
                  class="mt-3 ml-1"
                  v-model="isProductInCategory"
                  @change="getProductList"
                >Show only product in this promotion</b-form-checkbox>
              </b-col>
            </b-row>

            <b-row v-if="showProductList">
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
                      v-model="productListSelectedId"
                      @change="addProductName(data.item.name)"
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

                <b-row v-if="showProductList">
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

                <div class="mt-5">
                  <button
                    type="button"
                    class="btn btn-success btn-details-set text-uppercase"
                    @click="showProductList = !showProductList"
                  >Save</button>
                  <b-button
                    class="btn-details-set ml-0 ml-sm-2"
                    @click="showProductList = !showProductList"
                  >CANCEL</b-button>
                </div>
              </b-col>
            </b-row>

            <HeaderLine text="Action" class="my-4" />

            <b-row v-if="selected != 3">
              <b-col md="6">
                <InputText
                  :textFloat="`Discount (${this.promotionType})`"
                  :placeholder="`Discount (${this.promotionType})`"
                  type="text"
                  name="discountbaht"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>
            <b-row v-else>
              <b-col md="6">
                <InputText
                  textFloat="Number of X Product"
                  placeholder="Number of X Product"
                  type="text"
                  name="xproduct"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>

            <HeaderLine text="Applied" class="my-4" />

            <b-row v-if="selected != 3">
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox
                    size="lg"
                    id="condition"
                    v-model="isSameCondition"
                  >Use same as Conditions</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row v-if="selected != 3">
              <b-col md="6">
                <div class="panel d-flex align-items-md-center ml-1">
                  <b-form-checkbox size="lg" id="skips" class="mt-2">Skip Promotion Price</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <div v-if="!isSameCondition" class="mt-3">
              <b-row v-if="selected != 3">
                <b-col xl="6" lg="8">
                  <label class="label-text">Condition Scope</label>
                  <b-row>
                    <b-col md="6">
                      <div class="mt-2 mt-sm-2 mb-0 float-left">
                        <span v-if="conditionScopeSelectedApplied == 1">All</span>
                        <span v-if="conditionScopeSelectedApplied == 2">Product</span>
                        <span v-if="conditionScopeSelectedApplied == 3">Category</span>
                      </div>
                      <InputSelect
                        v-if="conditionScopeSelectedApplied != 1"
                        class="condition-type float-left"
                        name="type"
                        isRequired
                        v-model="conditionTypeSelectedApplied"
                        v-bind:options="conditionTypeList"
                        valueField="id"
                        textField="name"
                      />
                      <div class="mt-2">
                        <span
                          class="text-underline select-txt"
                          v-if="conditionScopeSelectedApplied != 1"
                          @click="addProductoCategoryApplied"
                        >Select</span>
                      </div>
                    </b-col>
                    <b-col md="6">
                      <InputSelect
                        name="type"
                        isRequired
                        v-model="conditionScopeSelectedApplied"
                        v-bind:options="conditionScopeList"
                        valueField="id"
                        textField="name"
                        @onDataChange="handleChangeConditionScopeApplied"
                      />
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <div>
                <p v-if="isCategoryApplied">{{categoryListSelectedApplied.toString()}}</p>
                <p v-if="isProductApplied">{{productListSelectedApplied.toString()}}</p>
              </div>

              <b-row v-if="showCategoryListApplied">
                <b-col xl="6" lg="8">
                  <div class="store-type-box px-4 mb-4 category-box">
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
                                @change="addCategoryApplied(item2.id,item2.name)"
                                v-model="categoryListSelectedIdApplied"
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
                            <b-form-checkbox
                              size="lg"
                              class="mt-3 ml-5"
                              v-bind:key="key3"
                              :value="item3.id"
                              v-model="categoryListSelectedIdApplied"
                              @change="addCategoryApplied(item3.id,item3.name)"
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
                      </template>
                    </template>
                  </div>
                  <div>
                    <button
                      type="button"
                      class="btn btn-success btn-details-set text-uppercase"
                      @click="showCategoryListApplied = !showCategoryListApplied"
                    >Save</button>
                    <b-button
                      class="btn-details-set ml-0 ml-sm-2"
                      @click="showCategoryListApplied = !showCategoryListApplied"
                    >CANCEL</b-button>
                  </div>
                </b-col>
              </b-row>

              <b-row v-if="showProductListApplied">
                <b-col md="6">
                  <b-input-group class="panel-input-serach">
                    <b-form-input
                      class="input-serach"
                      placeholder="Name, SKU"
                      @keyup="handleSearchApplied"
                      v-model="filterapplied.search"
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
                    v-model="isProductInCategoryApplied"
                    @change="getProductListApplied"
                  >Show only product in this promotion</b-form-checkbox>
                </b-col>
              </b-row>

              <b-row v-if="showProductListApplied">
                <b-col class="mt-4 w-100">
                  <b-table
                    responsive
                    striped
                    :fields="fields"
                    :items="productlistapplied"
                    :busy="isBusyApplied"
                    show-empty
                    empty-text="No matching records found"
                  >
                    <template v-slot:cell(id)="data">
                      <b-form-checkbox
                        size="lg"
                        class="ml-3"
                        :value="data.item.id"
                        v-model="productListSelectedIdApplied"
                        @change="addProductNameApplied(data.item.name)"
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

                  <b-row v-if="showProductListApplied">
                    <b-col class="form-inline justify-content-center justify-content-md-between">
                      <b-pagination
                        v-model="filterapplied.pageNo"
                        :total-rows="rowsApplied"
                        :per-page="filterapplied.perPage"
                        class="m-md-0"
                        @change="paginationApplied"
                      ></b-pagination>
                      <b-form-select
                        v-model="filterapplied.perPage"
                        @change="hanndleChangePerpageApplied"
                        :options="pageOptions"
                      ></b-form-select>
                    </b-col>
                  </b-row>

                  <div class="mt-5">
                    <button
                      type="button"
                      class="btn btn-success btn-details-set text-uppercase"
                      @click="showProductListApplied = !showProductListApplied"
                    >Save</button>
                    <b-button
                      class="btn-details-set ml-0 ml-sm-2"
                      @click="showProductListApplied = !showProductListApplied"
                    >CANCEL</b-button>
                  </div>
                </b-col>
              </b-row>
            </div>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button class="btn btn-danger btn-details-set mr-md-2" v-if="isEdit">REMOVE</b-button>
                <b-button href="/promotion" class="btn-details-set">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  v-if="isEdit"
                >Save</button>
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                >Save & Exit</button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </form>
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import InputSelect from "@/components/inputs/InputSelect";
import HeaderLine from "@/components/HeaderLine";
import Vue from "vue";

export default {
  name: "PromotionDetails",
  components: {
    InputText,
    InputSelect,
    HeaderLine
  },
  data() {
    return {
      parentList: [],
      languageList: [],
      categoryListSelected: [],
      categoryListSelectedId: [],
      productListSelected: [],
      productListSelectedId: [],
      categoryListSelectedApplied: [],
      categoryListSelectedIdApplied: [],
      productListSelectedApplied: [],
      productListSelectedIdApplied: [],
      categorys: [
        {
          categoryList: []
        }
      ],
      promotionType: "",
      isLoading: false,
      isSameCondition: false,
      isProductInCategory: false,
      isProductInCategoryApplied: false,
      hasCoupon: false,
      isEdit: false,
      isBusy: false,
      isBusyApplied: false,
      isCategory: false,
      isProduct: false,
      showProductList: false,
      showCategoryList: false,
      isCategoryApplied: false,
      isProductApplied: false,
      showProductListApplied: false,
      showCategoryListApplied: false,
      selected: 1,
      discountselected: 1,
      minimumselected: 1,
      rows: 0,
      rowsApplied: 0,
      userGroupSelected: 1,
      conditionScopeSelected: 1,
      conditionTypeSelected: 1,
      conditionScopeSelectedApplied: 1,
      conditionTypeSelectedApplied: 1,
      productlist: [],
      productlistapplied: [],
      typelist: [
        { id: 1, name: "Baht" },
        { id: 2, name: "Percent" },
        { id: 3, name: "Buy X Get Y" }
      ],
      discountlist: [
        { id: 1, name: "Baht" },
      ],
      conditionScopeList: [
        { id: 1, name: "All" },
        { id: 2, name: "Product" },
        { id: 3, name: "Category" }
      ],
      conditionTypeList: [
        { id: 1, name: "Include" },
        { id: 2, name: "Except" }
      ],
      userGroupList: [
        { id: 1, name: "General" },
        { id: 2, name: "Guest" },
        { id: 3, name: "Member" }
      ],
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
      filterapplied: {
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
    handleChangeConditionScope(value) {
      this.conditionScopeSelected = value;
      this.showProductList = false;
      this.showCategoryList = false;

      if (this.conditionScopeSelected == 2) {
        this.isProduct = true;
        this.isCategory = false;
      } else {
        this.isCategory = true;
        this.isProduct = false;
      }
    },
    handleChangeConditionScopeApplied(value) {
      this.conditionScopeSelectedApplied = value;
      this.showProductListApplied = false;
      this.showCategoryListApplied = false;

      if (this.conditionScopeSelectedApplied == 2) {
        this.isProductApplied = true;
        this.isCategoryApplied = false;
      } else {
        this.isCategoryApplied = true;
        this.isProductApplied = false;
      }
    },
    handleChangePromotionType(value) {
      this.selected = value;

      if (value == 1) {
        this.promotionType = "Baht";
      } else {
        this.promotionType = "Percent";
      }

      if (value == 3) {
        this.isSameCondition = false;
        this.showProductListApplied = true;
        this.getProductListApplied();
      } else {
        this.isSameCondition = true;
        this.showProductListApplied = false;
      }
    },
    getDatas: async function() {
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

      await this.productListSelectedId.forEach((element, index) => {
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
      }
    },
    getProductListApplied: async function() {
      this.isBusyApplied = true;

      Vue.nextTick(() => {
        if (this.isProductInCategoryApplied == true) {
          this.filterapplied.isProductInCategory = 1;
        } else {
          this.filterapplied.isProductInCategory = 0;
        }
      });

      this.filterapplied.productIdList = [];

      await this.productListSelectedIdApplied.forEach((element, index) => {
        this.filterapplied.productIdList.push(element);
      });

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
      }
    },
    addParent(ref) {
      this.parentList.push(ref);
    },
    deleteParent(ref) {
      var index = this.parentList.indexOf(ref);
      if (index !== -1) this.parentList.splice(index, 1);
    },
    addCategory: function(id, name) {
      var ids = this.categoryListSelectedId.indexOf(id);
      if (ids != -1) this.categoryListSelectedId.splice(ids, 1);
      else this.categoryListSelectedId.push(id);

      var index = this.categoryListSelected.indexOf(name);
      if (index != -1) this.categoryListSelected.splice(index, 1);
      else this.categoryListSelected.push(name);
    },
    addCategoryApplied: function(id, name) {
      var ids = this.categoryListSelectedIdApplied.indexOf(id);
      if (ids != -1) this.categoryListSelectedIdApplied.splice(ids, 1);
      else this.categoryListSelectedIdApplied.push(id);

      var index = this.categoryListSelectedApplied.indexOf(name);
      if (index != -1) this.categoryListSelectedApplied.splice(index, 1);
      else this.categoryListSelectedApplied.push(name);
    },
    addProductName: function(name) {
      var index = this.productListSelected.indexOf(name);
      if (index != -1) this.productListSelected.splice(index, 1);
      else this.productListSelected.push(name);
    },
    addProductNameApplied: function(name) {
      var index = this.productListSelectedApplied.indexOf(name);
      if (index != -1) this.productListSelectedApplied.splice(index, 1);
      else this.productListSelectedApplied.push(name);
    },
    addProductoCategory() {
      if (this.conditionScopeSelected == 2) {
        this.showProductList = true;
        this.getProductList();
      } else {
        this.showCategoryList = true;
      }
    },
    addProductoCategoryApplied() {
      if (this.conditionScopeSelectedApplied == 2) {
        this.showProductListApplied = true;
        this.getProductListApplied();
      } else {
        this.showCategoryListApplied = true;
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
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.pageNo = 1;
        this.getProductList();
      }
    },
    paginationApplied(Page) {
      this.filterapplied.pageNo = Page;
      this.getProductListApplied();
    },
    hanndleChangePerpageApplied(value) {
      this.filterapplied.pageNo = 1;
      this.filterapplied.perpage = value;
      this.getProductListApplied();
    },
    handleSearchApplied(e) {
      if (e.keyCode === 13) {
        this.filterapplied.pageNo = 1;
        this.getProductListApplied();
      }
    }
  }
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

.category-box {
  height: 300px;
}
</style>