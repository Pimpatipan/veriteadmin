<template>
  <div>
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
          @change="handleOnChangeIsProductInCategory"
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
              v-model="productSelectedList"
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
</template>

<script>
import Vue from "vue";

export default {
  props: {
    productlist: {
      required: true,
      type: Object | Array
    },
    rows: {
      required: false,
      type: Number
    },
    idList: {
      required: false,
      type: Array
    },
    isBusy: {
      required: false,
      type: Boolean
    },
    section: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      isProductInCategory: true,
      productSelectedList: this.idList,
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
          label: "SKU"
        },
        {
          key: "price",
          label: "Price",
          class: "text-right w-100px"
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
  methods: {
    handleOnChangeIsProductInCategory() {
      Vue.nextTick(() => {
        this.$emit("getProductList", this.isProductInCategory,1,this.productSelectedList);
      });
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.$emit(
          "handleSearch",
          this.filter.search,
          this.isProductInCategory
        );
      }
    },
    pagination(Page) {
      this.$emit("handleChangePagination", Page, this.isProductInCategory);
    },
    hanndleChangePerpage(value) {
      this.$emit("handleChangePerpage", value, this.isProductInCategory);
    },
    addProductName(name) {
      Vue.nextTick(() => {
        this.$emit(
          "addProductName",
          name,
          this.productSelectedList,
          this.section
        );
      });
    }
  }
};
</script>