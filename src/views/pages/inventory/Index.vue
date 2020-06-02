<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol sm="6" class="text-center text-sm-left">
        <h1 class="mr-sm-4">INVENTORY MANAGEMENT</h1>
      </CCol>
      <CCol sm="6" class="text-center text-sm-right">
        <b-dropdown id="dropdown-1" class="m-md-2 btn-mains small-dropdown" right no-flip>
          <template v-slot:button-content>ACTION</template>
          <b-dropdown-item href="/inventory/importdata">Import Inventory</b-dropdown-item>
          <b-dropdown-item @click="exportData">Export Inventory</b-dropdown-item>
        </b-dropdown>
      </CCol>
    </CRow>
    <div class="bg-white-border px-4 px-sm-5 py-4 mt-4">
      <b-row class="no-gutters mt-3">
        <b-col lg="6">
          <b-input-group class="panel-input-serach">
            <b-form-input
              class="input-serach"
              placeholder="Product, SKU"
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
        <b-col lg="6" class="text-center text-sm-right"></b-col>
      </b-row>
      <b-row>
        <b-col class="mt-4 w-100">
          <b-table
            responsive
            striped
            :fields="fields"
            :items="items"
            :busy="isBusy"
            show-empty
            empty-text="No matching records found"
          >
            <template v-slot:cell(productName)="data">
              <router-link :to="'/product/details/'+data.item.productId">
                <p class="mb-0 nobreak two-lines">{{data.item.productName}}</p>
              </router-link>
            </template>
            <template v-slot:cell(inStock)="data">
              <p class="m-0">{{data.item.inStock | numeral('0,0')}}</p>
            </template>
            <template v-slot:cell(productId)="data">
              <div class="d-flex justify-content-center">
                <b-button
                  variant="link"
                  class="text-primary px-1 py-0"
                  @click="setStockQty(data.item.productId,1,data.item.inStock)"
                >
                  <font-awesome-icon icon="plus" title="Increase" />
                </b-button>
                <b-button
                  variant="link"
                  class="text-danger px-1 py-0"
                  @click="setStockQty(data.item.productId,2,data.item.inStock)"
                >
                  <font-awesome-icon icon="minus" title="Decrease" />
                </b-button>
                <b-button
                  variant="link"
                  class="text-warning px-1 py-0"
                  @click="setStockQty(data.item.productId,3,data.item.inStock)"
                >
                  <font-awesome-icon icon="pencil-alt" title="Adjust" />
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

    <b-modal
      id="setStockModal"
      ref="setStockModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">
          <span v-if="setStockType == 1">Increase</span>
          <span v-else-if="setStockType == 2">Decrease</span>
          <span v-else>Adjust</span>
        </h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('setStockModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <InputText
                textFloat="Unit"
                placeholder="Unit"
                type="number"
                name="stock"
                isRequired
                v-model="newStock"
                @onKeypress="isNumber($event)"
                @onKeyup="setInStockData"
              />

              <label class="label-text my-3">
                In stock:
                <!-- <span
                      class="text-body pl-3"
                >{{ stockitems.stock.inStock | numeral('0,0') }}</span>-->

                <span class="text-body px-3">{{oldStock}}</span>
                <font-awesome-icon icon="arrow-right" title="arrow-rights" />
                <span class="text-body pl-3">{{inStockData}}</span>
              </label>

              <p v-if="stockerror" class="text-danger">{{stockMsgError}}</p>
            </b-col>
          </b-row>
          <div class="text-center mt-3">
            <b-button class="btn btn-main" :disabled="isDisable" @click="saveStock">Submit</b-button>
          </div>
        </b-container>
      </div>
    </b-modal>
  </CContainer>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import axios from "axios";
import * as moment from "moment/moment";

export default {
  name: "InventoryIndex",
  components: {
    InputText
  },
  data() {
    return {
      fields: [
        {
          key: "productName",
          label: "Product",
          class: "w-100px"
        },
        {
          key: "sku",
          label: "SKU",
          class: "w-100px"
        },
        {
          key: "inStock",
          label: "In Stock",
          class: "w-100px"
        },
        {
          key: "productId",
          label: "Action",
          class: "w-100px"
        }
      ],
      items: [],
      isBusy: false,
      stockMsgError: false,
      stockerror: false,
      isDisable: true,
      rows: 0,
      setStockType: 0,
      inStockData: 0,
      newStock: 0,
      oldStock: 0,
      productid: 0,
      filter: {
        perPage: 10,
        pageNo: 1,
        search: ""
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ],
      checkAll: false,
      selectAllCb: false,
      cbHighlight: false,
      selected: 0
    };
  },
  created: async function() {
    await this.getList();
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
    getList: async function() {
      this.isBusy = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/inventory/list`,
        null,
        this.$headers,
        this.filter
      );
      if (data.result == 1) {
        this.items = data.detail.dataList;
        this.rows = data.detail.count;
        this.isBusy = false;
      }
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.pageNo = 1;
        this.getList();
      }
    },
    pagination(Page) {
      this.filter.pageNo = Page;
      this.getList();
    },
    getDataByStatus() {
      this.$refs.dropdown.hide(true);
      this.getList();
    },
    checkStatusLength() {
      if (this.filter.status.length == 2) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
    },
    checkAllSelect() {
      if (this.selectAllCb) {
        this.filter.status = [];
      } else {
        this.filter.status = [1, 0];
      }
    },
    hanndleChangePerpage(value) {
      this.filter.pageNo = 1;
      this.filter.perPage = value;
      this.getList();
    },
    setStockQty(id, type, instock) {
      this.productid = id;
      this.setStockType = type;
      this.oldStock = instock;
      this.inStockData = instock;

      this.$refs["setStockModal"].show();
    },
    setInStockData(value) {
      if (this.newStock != "" || this.newStock != 0) {
        this.isDisable = false;
        if (this.setStockType == 1) {
          this.inStockData = parseInt(this.newStock) + parseInt(this.oldStock);
        } else if (this.setStockType == 2) {
          this.inStockData = parseInt(this.oldStock) - parseInt(this.newStock);
        } else if (this.setStockType == 3) {
          this.inStockData = this.newStock;
        }
      } else {
        this.isDisable = true;
        this.inStockData = this.oldStock;
      }
    },
    saveStock: async function() {
      let modalData = {
        productId: this.productid,
        quantity: this.newStock,
        actionId: this.setStockType
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveStock`,
        null,
        this.$headers,
        modalData
      );

      if (data.result == 1) {
        this.stockerror = false;
        this.$refs["setStockModal"].hide();
        this.getList();
        this.newStock = 0;
      }
    },
    exportData: async function() {
      axios({
        url: `${this.$baseUrl}/api/inventory/exportInventory`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: this.filter
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var dateExcel = moment().format("DDMMYYYYhhmmss");

        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          `Inventory-List-` + dateExcel + `.xlsx`
        );
        document.body.appendChild(fileLink);
        fileLink.click();
      });
    }
  }
};
</script>