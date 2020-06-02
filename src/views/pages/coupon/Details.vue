<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Coupon Details</h1>
          </b-col>
        </b-row>

        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4">
            <b-row class="pl-1 my-3">
              <b-col md="6">
                <div class="panel d-flex align-items-md-center">
                  <b-form-checkbox
                    size="lg"
                    id="sameLang"
                    class="mt-3"
                    @change="useSameLanguage"
                    v-model="form.promocode.isSameLanguage"
                  >ใช้เหมือนกันทุกภาษา</b-form-checkbox>
                </div>
              </b-col>
              <b-col md="6" class="text-right">
                <b-button
                  type="button"
                  class="btn btn-language"
                  v-for="(language, index) in languageList"
                  v-bind:key="index"
                  v-bind:class="[ languageActive == language.id ? 'active' : '' ]"
                  @click="changeLanguage(language.id,index)"
                  :disabled="form.promocode.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <div v-for="(item, index) in form.promocode.translationList" v-bind:key="index">
              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <b-row>
                  <b-col>
                    <InputText
                      class="mb-4"
                      textFloat="Coupon Name"
                      placeholder="Coupon Name"
                      type="text"
                      name="name"
                      isRequired
                      v-model="item.name"
                      :img="imageLogoLang"
                      :isValidate="$v.form.promocode.translationList.$each.$iter[index].name.$error"
                      :v="$v.form.promocode.translationList.$each.$iter[index].name"
                    />
                  </b-col>
                </b-row>
              </div>

              <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                <b-row>
                  <b-col>
                    <InputTextArea
                      class="mb-4"
                      textFloat="Description"
                      placeholder="Description"
                      type="text"
                      name="name"
                      isRequired
                      :img="imageLogoLang"
                      v-model="item.description"
                      :isValidate="$v.form.promocode.translationList.$each.$iter[index].description.$error"
                      :v="$v.form.promocode.translationList.$each.$iter[index].description"
                    />
                  </b-col>
                </b-row>
              </div>
            </div>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Code"
                  placeholder="Code"
                  type="text"
                  name="code"
                  v-model="form.promocode.prefix"
                  isRequired
                  :isValidate="$v.form.promocode.prefix.$error"
                  :v="$v.form.promocode.prefix"
                  :disabled="isStart"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Uses per Coupon"
                  placeholder="Uses per Coupon"
                  type="text"
                  name="usepercoupon"
                  isRequired
                  v-model="form.promocode.quantity"
                  @onKeypress="isNumber($event)"
                  :isValidate="$v.form.promocode.quantity.$error"
                  :v="$v.form.promocode.quantity"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Uses per Customer"
                  placeholder="Uses per Customer"
                  type="text"
                  name="usepercustomer"
                  isRequired
                  @onKeypress="isNumber($event)"
                  v-model="form.promocode.maxUsedPerPerson"
                  :isValidate="$v.form.promocode.maxUsedPerPerson.$error"
                  :v="$v.form.promocode.maxUsedPerPerson"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Minimum Spend"
                  placeholder="Minimum Spend"
                  type="text"
                  name="minspend"
                  isRequired
                  v-model="form.promocode.requiredBaht"
                  @onKeypress="isNumber($event)"
                  :isValidate="$v.form.promocode.requiredBaht.$error"
                  :v="$v.form.promocode.requiredBaht"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <label class="label-text">
                  Valid from
                  <span class="text-danger">*</span>
                </label>
                <datetime
                  v-model="form.promocode.startDate"
                  placeholder="Please select date"
                  class="date-picker"
                  format="dd/MM/yyyy"
                  :disabled="isStart"
                ></datetime>
                <p
                  class="text-danger"
                  v-if="error"
                >The Valid from date must be earlier than end date</p>
              </b-col>
              <b-col md="6">
                <label class="label-text">
                  Valid to
                  <span class="text-danger">*</span>
                </label>
                <datetime
                  v-model="form.promocode.endDate"
                  placeholder="Please select date"
                  class="date-picker"
                  format="dd/MM/yyyy"
                ></datetime>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <label class="label-text mb-2">Coupon type</label>
                <b-row class="mb-3 mb-sm-0">
                  <b-col
                    md="4"
                    class="mb-1 mb-sm-0"
                    v-for="(item,index) in couponType"
                    v-bind:key="index"
                  >
                    <b-form-radio
                      name="some-radios"
                      v-model="form.promocode.couponTypeDetailId"
                      :value="item.id"
                      :disabled="isStart"
                    >{{item.name}}</b-form-radio>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="6">
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="form.promocode.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span
                      class="ml-2 main-label"
                    >{{form.promocode.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div class="panel d-flex align-items-md-center mt-3 ml-1">
                  <b-form-checkbox
                    size="lg"
                    id="firstPurchase"
                    class="mt-3"
                    v-model="form.promocode.firstPurchasedOnly"
                  >First Purchase Only</b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <HeaderLine text="Condition" class="my-4" />

            <div>
              <b-row v-if="form.promocode.couponTypeDetailId == 0">
                <b-col md="6">
                  <InputText
                    textFloat="Discount Value"
                    placeholder="Discount Value"
                    type="text"
                    name="discountval"
                    isRequired
                    v-model="form.promocode.amount"
                    @onKeypress="isNumber($event)"
                    :isValidate="$v.form.promocode.amount.$error"
                    :v="$v.form.promocode.amount"
                  />
                </b-col>
                <b-col md="6">
                  <label class="label-text mb-2">Discount Type</label>
                  <b-row class="mb-3 mb-sm-0">
                    <b-col
                      md="6"
                      class="mb-1 mb-sm-0"
                      v-for="(item,index) in conditionType"
                      v-bind:key="index"
                    >
                      <b-form-radio
                        name="some-type"
                        v-model="form.promocode.discountTypeId"
                        :value="item.id"
                        :disabled="isStart"
                      >{{item.name}}</b-form-radio>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <b-row v-if="form.promocode.couponTypeDetailId == 3">
                <b-col md="6">
                  <InputText
                    textFloat="Required Quantity"
                    placeholder="Required Quantity"
                    type="text"
                    name="discountval"
                    isRequired
                    v-model="form.promocode.requiredProduct"
                    @onKeypress="isNumber($event)"
                  />
                </b-col>
              </b-row>

              <b-row class="mt-3">
                <b-col md="2">
                  <h4 class="mb-1 font-weight-bold">Product List</h4>
                </b-col>
                <b-col md="7">
                  <b-row class="mt-1">
                    <b-col
                      md="4"
                      class="mb-1 mb-sm-0"
                      v-for="(item,index) in productSelectType"
                      v-bind:key="index"
                    >
                      <b-form-radio
                        name="some-types"
                        v-model="form.promocode.productSelectTypeId"
                        :value="item.id"
                      >{{item.name}}</b-form-radio>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col md="3" class="text-right">
                  <b-button
                    class="btn-main"
                    @click="addEditProduct(1)"
                    v-if="form.promocode.productSelectTypeId != 1"
                  >ADD</b-button>
                </b-col>

                <b-col v-if="form.promocode.productSelectTypeId != 1">
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
                    v-if="$v.form.promocode.promocodeBuyProductList.$error"
                    class="text-danger"
                  >Please select at least one product</p>
                </b-col>
              </b-row>
              <b-row v-if="form.promocode.productSelectTypeId != 1">
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

              <div v-if="form.promocode.couponTypeDetailId == 3">
                <b-row class="mt-5">
                  <b-col cols="6">
                    <h4 class="mb-1 font-weight-bold">Sample List</h4>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <b-button class="btn-main" @click="addEditProduct(2)">ADD</b-button>
                  </b-col>

                  <b-col>
                    <b-table
                      responsive
                      striped
                      :fields="samplelistfields"
                      :items="samplelistitems"
                      :busy="isBusy"
                      show-empty
                      empty-text="No matching records found"
                      class="mt-4"
                    >
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
                      <template v-slot:cell(id)="data">
                        <div class="d-flex justify-content-center">
                          <b-button
                            variant="link"
                            class="text-danger px-1 py-0"
                            @click="deleteProduct(data.item.id,2)"
                          >
                            <font-awesome-icon icon="trash-alt" title="Delete" />
                          </b-button>
                        </div>
                      </template>
                    </b-table>

                    <p
                      v-if="$v.form.promocode.promocodeGiftProducttList.$error"
                      class="text-danger"
                    >Please select at least one sample product</p>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col class="form-inline justify-content-center justify-content-md-between">
                    <b-pagination
                      v-model="filter.pageNo"
                      :total-rows="samplelistrows"
                      :per-page="samplelistfilter.perPage"
                      class="m-md-0"
                      @change="paginationSample"
                    ></b-pagination>
                    <b-form-select
                      v-model="samplelistfilter.perPage"
                      @change="hanndleChangePerpageSample"
                      :options="pageOptions"
                    ></b-form-select>
                  </b-col>
                </b-row>
              </div>
            </div>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button
                  class="btn btn-danger btn-details-set mr-md-2"
                  v-if="isEdit"
                  :disabled="isDisable"
                  @click="deleteData()"
                >REMOVE</b-button>
                <b-button href="/coupon" isabled="isDisable" class="btn-details-set">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  v-if="isEdit"
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
        <h3 class="font-weight-bold">
          <span v-if="addProductType == 1">Product</span>
          <span v-else>Sample</span>
          List
        </h3>
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
                  <b-form-checkbox
                    size="lg"
                    class="ml-3"
                    :value="data.item.id"
                    v-model="selected"
                    v-if="addProductType == 1"
                  ></b-form-checkbox>
                  <b-form-checkbox
                    size="lg"
                    class="ml-3"
                    :value="data.item.id"
                    v-model="selectedSample"
                    v-else
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
import HeaderLine from "@/components/HeaderLine";
import InputTextArea from "@/components/inputs/InputTextArea";
import Vue from "vue";
import * as moment from "moment/moment";
import { required, requiredIf } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";

export default {
  name: "CouponDetails",
  components: {
    InputText,
    HeaderLine,
    InputTextArea,
    ModalAlert
  },
  data() {
    return {
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
          class: "w-200",
          tdClass: "text-left"
        },
        {
          key: "price",
          label: "Price",
          class: "w-100px"
        }
      ],
      productlistfields: [
        {
          key: "imageUrl",
          label: "Thumbnail",
          class: "w-100px"
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
          class: "w-100px"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      samplelistfields: [
        {
          key: "imageUrl",
          label: "Thumbnail",
          class: "w-100px"
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
          class: "w-100px"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      languageList: [],
      items: [],
      productlistitems: [],
      samplelistitems: [],
      productitems: [],
      couponType: [],
      discountType: [],
      conditionType: [],
      productSelectType: [],
      imageLogoLang: "",
      languageActive: 1,
      rows: 0,
      samplelistrows: 0,
      productlistrows: 0,
      productrows: 0,
      flag: 0,
      addProductType: 0,
      isEdit: false,
      error: false,
      isDisable: false,
      isStart: false,
      isBusy: false,
      isBusys: false,
      modalAlertShow: false,
      imgModal: null,
      msgModal: null,
      id: this.$route.params.id,
      selected: [],
      selectedSample: [],
      type: 1,
      filter: {
        status: [],
        search: "",
        perpage: 5,
        pageNo: 1
      },
      productfilter: {
        search: "",
        pageNo: 1,
        perPage: 5
      },
      productlistfilter: {
        productId: [],
        pageNo: 1,
        perPage: 5
      },
      samplelistfilter: {
        productId: [],
        pageNo: 1,
        perPage: 5
      },
      pageOptions: [
        { value: 5, text: "5 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ],
      form: {
        promocode: {
          isSameLanguage: false,
          promocodeBuyProductList: [],
          promocodeGiftProducttList: [],
          productSelectTypeId: 0,
          couponTypeDetailId: 0,
          translationList: [
            {
              languageId: 1,
              name: null,
              description: null
            },
            {
              languageId: 2,
              name: null,
              description: null
            }
          ],
          id: 0,
          prefix: null,
          quantity: 0,
          startDate: "0001-01-01T00:00:00",
          endDate: "0001-01-01T00:00:00",
          enabled: false,
          requiredBaht: 0.0,
          requiredProduct: 0,
          firstPurchasedOnly: false,
          discountTypeId: 0,
          amount: 0.0,
          maxUsedPerPerson: 0,
          mainLanguageId: 0
        }
      }
    };
  },
  validations: {
    form: {
      promocode: {
        prefix: { required },
        quantity: { required },
        startDate: { required },
        endDate: { required },
        requiredBaht: { required },
        maxUsedPerPerson: { required },
        promocodeBuyProductList: {
          required: requiredIf(function() {
            return this.form.promocode.productSelectTypeId != 1;
          })
        },
        promocodeGiftProducttList: {
          required: requiredIf(function() {
            return this.form.promocode.couponTypeDetailId == 3;
          })
        },
        amount: {
          required: requiredIf(function() {
            return this.form.promocode.couponTypeDetailId == 0;
          })
        },
        translationList: {
          $each: {
            name: { required },
            description: { required }
          }
        }
      }
    }
  },
  created: async function() {
    await this.getDatas();
  },
  methods: {
    moment: function() {
      return moment();
    },
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
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
          if (this.addProductType == 1) {
            for (const promocodeBuyProductList of this.form.promocode
              .promocodeBuyProductList) {
              this.selected.push(promocodeBuyProductList);
            }
          } else {
            for (const promocodeGiftProducttList of this.form.promocode
              .promocodeGiftProducttList) {
              this.selectedSample.push(promocodeGiftProducttList);
            }
          }
        });
      }

      this.$refs["addProductModal"].show();
    },
    addProductToTable: async function() {
      this.$refs["addProductModal"].hide();
      if (this.addProductType == 1) {
        this.form.promocode.promocodeBuyProductList = [];
        for (const selected of this.selected) {
          this.form.promocode.promocodeBuyProductList.push(selected);
        }
        this.getProductSampleData(this.selected, 1);
      } else {
        this.form.promocode.promocodeGiftProducttList = [];
        for (const selected of this.selectedSample) {
          this.form.promocode.promocodeGiftProducttList.push(selected);
        }
        this.getProductSampleData(this.selectedSample, 2);
      }
    },
    getDatas: async function() {
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
        `${this.$baseUrl}/api/coupon/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        if (this.form.promocode.id > 0) {
          this.isEdit = true;
          await this.getProductSampleData(
            this.form.promocode.promocodeBuyProductList,
            1
          );
          await this.getProductSampleData(
            this.form.promocode.promocodeGiftProducttList,
            2
          );

          if (new Date(this.form.promocode.startDate) < new Date()) {
            this.isStart = true;
          }
        } else {
          this.form.promocode.startDate = moment().format();
          this.form.promocode.endDate = moment().format();
          this.form.promocode.discountTypeId = 1;
          this.form.promocode.productSelectTypeId = 1;
        }
      }

      let types = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/coupon/couponTypeDetail`,
        null,
        this.$headers,
        null
      );

      if (types.result == 1) {
        this.couponType = types.detail;
      }

      let conditions = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/coupon/CouponTypeCondition`,
        null,
        this.$headers,
        null
      );

      if (conditions.result == 1) {
        this.conditionType = conditions.detail;
      }

      if (types.result == 1) {
        this.couponType = types.detail;
      }

      let selecttype = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/coupon/productSelectType`,
        null,
        this.$headers,
        null
      );

      if (selecttype.result == 1) {
        this.productSelectType = selecttype.detail;
      }
    },
    getProductSampleData: async function(idList, flag) {
      this.isBusy = true;
      let filters;
      if (flag == 1) {
        filters = this.productlistfilter;
        this.productlistfilter.productId = idList;
      } else {
        filters = this.samplelistfilter;
        this.samplelistfilter.productId = idList;
      }
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/coupon/getProductList`,
        null,
        this.$headers,
        filters
      );

      if (data.result == 1) {
        this.isBusy = false;
        if (flag == 1) {
          this.productlistitems = data.detail.dataList;
          this.productlistrows = data.detail.count;
        } else {
          this.samplelistitems = data.detail.dataList;
          this.samplelistrows = data.detail.count;
        }
      }
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.promocode.isSameLanguage) {
          this.form.promocode.mainLanguageId = this.languageActive;
          let data = this.form.promocode.translationList.filter(
            val => val.languageId == this.form.promocode.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.promocode.translationList.length;
                index++
              ) {
                this.form.promocode.translationList[index].name = data.name;
                this.form.promocode.translationList[index].description =
                  data.description;
              }
            }
          }
        } else {
          let data = this.form.promocode.translationList.filter(
            val => val.languageId != this.form.promocode.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.name = "";
              data.description = "";
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
            this.$v.form.promocode.translationList.$each.$iter[index].$error
          ) {
            this.languageActive = this.$v.form.promocode.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    pagination(Page) {
      this.productlistfilter.pageNo = Page;
      this.getProductSampleData(this.form.promocode.promocodeBuyProductList, 1);
    },
    hanndleChangePerpage(value) {
      this.productlistfilter.pageNo = 1;
      this.productlistfilter.perPage = value;
      this.getProductSampleData(this.form.promocode.promocodeBuyProductList, 1);
    },
    paginationSample(Page) {
      this.samplelistfilter.pageNo = Page;
      this.getProductSampleData(
        this.form.promocode.promocodeGiftProducttList,
        2
      );
    },
    hanndleChangePerpageSample(value) {
      this.samplelistfilter.pageNo = 1;
      this.samplelistfilter.perPage = value;
      this.getProductSampleData(
        this.form.promocode.promocodeGiftProducttList,
        2
      );
    },
    paginationProduct(Page) {
      this.productfilter.pageNo = Page;
      this.addEditProduct(this.addProductType);
    },
    hanndleChangePerpageProduct(value) {
      this.productfilter.pageNo = 1;
      this.productfilter.perPage = value;
      this.addEditProduct(this.addProductType);
    },
    checkForm: async function(flag) {
      if (this.form.promocode.isSameLanguage) {
        await this.useSameLanguage();
      }
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        await this.checkValidateTranslationList();
        return;
      }
      if (
        new Date(this.form.promocode.endDate) <
        new Date(this.form.promocode.startDate)
      ) {
        this.error = true;
        return;
      }

      this.error = false;
      this.modalAlertShow = false;
      this.flag = flag;
      this.submit();
    },
    submit: async function() {
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/coupon/save`,
        null,
        this.$headers,
        this.form
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
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/coupon";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          window.location.href = "/coupon";
        }
      }
    },
    deleteData: async function() {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/coupon/remove/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/coupon";
        }
      }
    },
    deleteProduct(id, flag) {
      let array = [];
      let selected = [];
      let index = "";

      if (flag == 1) {
        array = this.form.promocode.promocodeBuyProductList;
        selected = this.selected;
      } else {
        array = this.form.promocode.promocodeGiftProducttList;
        selected = this.selectedSample;
      }
      index = array.indexOf(id);
      if (index > -1) {
        array.splice(index, 1);
        selected.splice(index, 1);
      }
      this.getProductSampleData(array, flag);
    }
  }
};
</script>