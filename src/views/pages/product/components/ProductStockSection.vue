<template>
  <div>
    <form class="form-box">
      <b-row class="no-gutters bg-white-border">
        <b-col class="px-4 px-sm-5 py-4">
          <b-row>
            <b-col md="6">
              <b-row>
                <b-col sm="6">
                  <label class="label-text my-3">
                    In stock:
                    <span
                      class="text-body pl-3"
                    >{{ stockitems.stock.inStock | numeral('0,0') }}</span>
                  </label>
                </b-col>
                <b-col sm="6" class="text-sm-right my-2 my-sm-3" v-if="id != 0">
                  <span class="ml-sm-2 text-underline pointer" @click="setStockQty(1)">Increase</span>
                  <span class="ml-2 text-underline pointer" @click="setStockQty(2)">Decrease</span>
                  <span class="ml-2 text-underline pointer" @click="setStockQty(3)">Adjust</span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <HeaderLine text="Stock log" class="my-4" />

          <b-row>
            <b-col sm="6">
              <label class="label-text">On hold : {{ stockitems.stock.onHold | numeral('0,0') }}</label>
            </b-col>
            <b-col sm="6" class="mt-2 mt-md-0">
              <label class="label-text">Available: {{ stockitems.stock.available | numeral('0,0') }}</label>
            </b-col>
          </b-row>

          <div class="mt-3">
            <div class="text-right mb-3">
              <b-dropdown id="dropdown-form" right ref="dropdown" class="m-2 btn-filter" no-flip>
                <template v-slot:button-content>
                  <font-awesome-icon icon="filter" class="mr-2" />FILTER
                </template>

                <div>
                  <p class="font-weight-bold mb-2">Order Status</p>
                </div>

                <div class="row">
                  <div class="col-6" v-for="status in stockFilterList" :key="status.id">
                    <div class="form-check mb-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="status.id"
                        v-model="filterStock.status"
                        :id="'status-'+status.id"
                      />
                      <label class="form-check-label" :for="'status-'+status.id">{{status.name}}</label>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-6">
                    <p class="font-weight-bold my-2">Start Date</p>
                    <datetime
                      v-model="filterStock.startDate"
                      placeholder="Please select date"
                      class="date-filter"
                    ></datetime>
                  </div>
                  <div class="col-6">
                    <p class="font-weight-bold my-2">End Date</p>
                    <datetime
                      v-model="filterStock.endDate"
                      placeholder="Please select date"
                      class="date-filter"
                    ></datetime>
                  </div>
                </div>

                <div class="text-center mt-3">
                  <button
                    type="button"
                    class="btn btn-primary button"
                    @click="getDataByStockFilter()"
                  >Submit</button>
                </div>
              </b-dropdown>
              <button type="button" class="btn btn-main button" @click="exportStockData" v-if="id != 0">EXPORT</button>
            </div>
            <b-table
              striped
              responsive
              hover
              :items="stockitems.stockLog.stockLogList"
              :fields="stockFields"
              :busy="isBusy"
              show-empty
              empty-text="No matching records found"
            >
              <template v-slot:cell(createdTime)="data">
                <span>{{ new Date(data.item.createdTime) | moment($formatDate) }}</span>
              </template>
              <template v-slot:cell(originalQuantity)="data">
                <div>
                  <p class="m-0">{{ data.item.originalQuantity | numeral('0,0') }}</p>
                </div>
              </template>
              <template v-slot:cell(updateQuantity)="data">
                <div>
                  <p class="m-0">{{ data.item.updateQuantity | numeral('0,0') }}</p>
                </div>
              </template>
              <template v-slot:cell(balance)="data">
                <div>
                  <p class="m-0">{{ data.item.balance | numeral('0,0') }}</p>
                </div>
              </template>
              <template v-slot:cell(referenceNo)="data">
                <div v-if="data.item.referenceNo == null">-</div>
                <div v-else>{{data.item.referenceNo}}</div>
              </template>
              <template v-slot:cell(note)="data">
                <div v-if="data.item.note == ''">-</div>
                <div v-else>{{data.item.note}}</div>
              </template>
              <template v-slot:table-busy>
                <div class="text-center text-black my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong class="ml-2">Loading...</strong>
                </div>
              </template>
            </b-table>
          </div>
          <b-row>
            <b-col class="form-inline justify-content-center justify-content-md-between">
              <b-pagination
                v-model="filterStock.pageNo"
                :total-rows="rowsStock"
                :per-page="filterStock.perPage"
                class="m-md-0"
                @change="paginationStock"
              ></b-pagination>
              <b-form-select
                @change="hanndleChangePerpageStock"
                v-model="filterStock.perPage"
                :options="pageOptions"
              ></b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-5">
            <b-col md="6">
              <b-button href="/product" class="btn-details-set">CANCEL</b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </form>

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
          Stock
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
                textFloat="Current Stock"
                placeholder="Current Stock"
                type="text"
                name="currentstock"
                disabled
                v-model="stockitems.stock.inStock"
              />

              <InputText
                textFloat="Stock"
                placeholder="Stock"
                type="number"
                name="stock"
                isRequired
                v-model="newStock"
                @onKeypress="isNumber($event)"
              />

              <p v-if="stockerror" class="text-danger">{{stockMsgError}}</p>
            </b-col>
          </b-row>
          <div class="text-center mt-3">
            <b-button class="btn btn-main" :disabled="isDisable" @click="saveStock">Submit</b-button>
          </div>
        </b-container>
      </div>
    </b-modal>
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import * as moment from "moment/moment";
import axios from "axios";
import HeaderLine from "@/components/HeaderLine";

export default {
  name: "ProductStock",
  components: {
    InputText,
    HeaderLine
  },
  data() {
    return {
      id: this.$route.params.id,
      isDisable: false,
      isEdit: false,
      isBusy: false,
      error: false,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      flagStock: 0,
      stockFilterList: [],
      stockitems: {
        stock: {
          productId: 0,
          onHold: 0,
          available: 0,
          inStock: 0
        },
        stockLog: {
          count: 0,
          stockLogList: []
        }
      },
      stockMsgError: "",
      stockerror: false,
      setStockType: 0,
      rowsStock: 0,
      newStock: 0,
      stockFields: [
        {
          key: "createdTime",
          label: "Date/Time"
        },
        {
          key: "originalQuantity",
          label: "Opening Balance"
        },
        {
          key: "updateQuantity",
          label: "Inwards/Outwards"
        },
        {
          key: "balance",
          label: "Closing Balance"
        },
        {
          key: "referenceNo",
          label: "Reference No."
        },
        {
          key: "note",
          label: "Note"
        },
        {
          key: "createdBy",
          label: "Update by"
        }
      ],
      filterStock: {
        perPage: 10,
        pageNo: 1,
        startDate: "",
        endDate: "",
        status: []
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ]
    };
  },
  created: async function() {
    if (this.id != 0) {
      await this.getStockData();
    }
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
    moment: function() {
      return moment();
    },
    handleCloseModal: async function() {
      if (this.flag == 1) {
        window.location.href = "/product";
      } else {
        if (this.id > 0) {
          this.getStockData();
        } else {
          window.location.href = "/product";
        }
      }
    },
    getStockData: async function() {
      this.isBusy = true;
      let stockList = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/stock/${this.id}`,
        null,
        this.$headers,
        this.filterStock
      );

      if (stockList.result == 1) {
        this.stockitems = stockList.detail;
        this.rowsStock = stockList.detail.stockLog.count;
        this.isBusy = false;
      }

      let stockFilterList = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/StockStatus`,
        null,
        this.$headers,
        null
      );

      if (stockFilterList.result == 1) {
        this.stockFilterList = stockFilterList.detail;
      }
    },
    setStockQty(type) {
      this.setStockType = type;
      this.$refs["setStockModal"].show();
    },
    saveStock: async function() {
      let modalData = {
        productId: this.id,
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
        this.getStockData();
        this.newStock = 0;
      } else {
        this.stockerror = true;
        this.stockMsgError = data.detail[0];
      }
    },
    paginationStock(Page) {
      this.filterStock.pageNo = Page;
      this.getStockData();
    },
    hanndleChangePerpageStock(value) {
      this.filterStock.pageNo = 1;
      this.filterStock.perPage = value;
      this.getStockData();
    },
    getDataByStockFilter() {
      this.$refs.dropdown.hide(true);
      this.getStockData();
    },
    exportStockData: async function() {
      axios({
        url: `${this.$baseUrl}/api/product/exportStockLog/${this.id}`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: this.filterStock
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var dateExcel = moment().format("DDMMYYYYhhmmss");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", `Stock-Log-` + dateExcel + `.xlsx`);
        document.body.appendChild(fileLink);
        fileLink.click();
      });
    }
  }
};
</script>