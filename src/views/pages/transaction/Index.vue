<template>
  <CContainer class="min-vh-100">
    <CRow class="no-gutters px-3 px-sm-0">
      <CCol cols="6">
        <h1 class="mr-sm-4">ORDER</h1>
      </CCol>
      <CCol cols="6" class="text-right">
        <b-dropdown id="dropdown-1" class="mr-2 btn-mains small-dropdown medium-dd" right no-flip>
          <template v-slot:button-content>
            <font-awesome-icon icon="ellipsis-v" title="filter-btn" class="text-white d-sm-none" />
            <span class="d-none d-sm-inline">ACTION</span>
          </template>
          <b-dropdown-item href="/order/importdata">Import Tracking No.</b-dropdown-item>
          <b-dropdown-item @click="exportData">Export Data</b-dropdown-item>
          <b-dropdown-item @click="downloadShippingLabel">Download Shipping Label</b-dropdown-item>
          <b-dropdown-item
            @click="downloadTemplate"
            class="wrap-normal"
          >Download Tracking No. Template</b-dropdown-item>
        </b-dropdown>
        <b-button v-b-toggle.sidebar-1 class="btn-filter">
          <font-awesome-icon icon="filter" title="filter-btn" class="text-white mr-0 mr-sm-1" />
          <span class="d-none d-sm-inline">FILTER</span>
        </b-button>
        <button type="button" class="btn btn-success button d-none">CREATE NEW</button>
      </CCol>
    </CRow>
    <b-sidebar
      id="sidebar-1"
      title="FILTER"
      backdrop
      shadow
      backdrop-variant="dark"
      right
      ref="filterSidebar"
    >
      <div class="px-3 py-2">
        <div>
          <p class="font-weight-bold mb-2">Order Status</p>
        </div>

        <div class="row">
          <div class="col-12" v-for="status in filterList.orderStatusList" :key="status.id">
            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="checkbox"
                :value="status.id"
                v-model="filter.Status"
                checked="checked"
                :id="'status-'+status.id"
              />
              <label class="form-check-label" :for="'status-'+status.id">{{status.name}}</label>
            </div>
          </div>
        </div>

        <div>
          <p class="font-weight-bold my-3">Payment Type</p>
        </div>

        <div class="row">
          <div class="col-6" v-for="payment in filterList.paymentTypeList" :key="payment.id">
            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="checkbox"
                :value="payment.id"
                v-model="filter.PaymentChanel"
                checked="checked"
                :id="'type-'+payment.id"
              />
              <label class="form-check-label" :for="'type-'+payment.id">{{payment.name}}</label>
            </div>
          </div>
        </div>

        <div class="row mt-2">
          <div class="col-6">
            <p class="font-weight-bold my-2">Start Date</p>
            <datetime
              v-model="filter.StartDate"
              placeholder="Please select date"
              class="date-filter"
            ></datetime>
          </div>
          <div class="col-6">
            <p class="font-weight-bold my-2">End Date</p>
            <datetime v-model="filter.EndDate" placeholder="Please select date" class="date-filter"></datetime>
          </div>
        </div>

        <p class="text-danger text-center my-3" v-if="error">Please enter correct date</p>

        <div class="text-center mt-3">
          <button
            type="button"
            class="btn bg-main-color text-white button"
            @click="getDataByStatus()"
          >Submit</button>
        </div>
      </div>
    </b-sidebar>
    <div class="bg-white-border px-4 px-sm-5 pb-3 mt-3">
      <b-row class="no-gutters mt-3">
        <b-col lg="6">
          <b-input-group class="panel-input-serach">
            <b-form-input
              class="input-serach"
              @keyup="handleSearch"
              placeholder="Buyer Name, Quotation No., Receipt No., Telephone, Payment Ref."
              v-model="filter.Search"
            ></b-form-input>
            <b-input-group-prepend>
              <span class="icon-input m-auto pr-2">
                <font-awesome-icon icon="search" />
              </span>
            </b-input-group-prepend>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <b-table
            responsive
            striped
            :fields="fields"
            :items="items"
            :busy="isBusy"
            show-empty
            empty-text="No matching records found"
            class="transaction-table"
          >
            <template v-slot:cell(ids)="data">
              <b-form-checkbox size="lg" class="ml-3" :value="data.item.id" v-model="selected"></b-form-checkbox>
            </template>
            <template v-slot:head(ids)="data">
              <b-form-checkbox size="lg" class="ml-3" :ref="data.field.key" v-model="selectedAll"></b-form-checkbox>
            </template>
            <template v-slot:cell(updatedTime)="data">
              <span>{{ new Date(data.item.updatedTime) | moment("DD MMM YYYY HH:mm") }}</span>
            </template>
            <template v-slot:cell(receiptNo)="data">
              <div v-if="data.item.receiptNo != ''" class="d-inline-block">{{data.item.receiptNo}}</div>
              <div v-else class="d-inline-block">{{data.item.quotationNo}}</div>
              <font-awesome-icon icon="file-invoice" title="ขอใบกำกับภาษี" v-if="data.item.requestTax" class="text-primary ml-2"/>
            </template>
            <template v-slot:cell(status)="data">
              <div v-if="data.item.orderStatusId == 1" class="text-success">{{data.item.status}}</div>
              <div v-else-if="data.item.orderStatusId == 2" class="txt-purple">{{data.item.status}}</div>
              <div v-else-if="data.item.orderStatusId == 4" class="text-primary">{{data.item.status}}</div>
              <div v-else-if="data.item.orderStatusId >=5" class="text-danger">{{data.item.status}}</div>
              <div v-else class="text-warning">{{data.item.status}}</div>
            </template>
            <template v-slot:cell(paymentChanel)="data">
              <div>
                <p class="m-0">{{data.item.paymentChanel}}</p>
                <p class="m-0" v-if="data.item.paymentRef != null">{{data.item.paymentRef}}</p>
              </div>
            </template>
            <template v-slot:cell(amount)="data">
              <div>
                <p class="m-0 text-right">{{ data.item.amount | numeral('0,0.00') }}</p>
              </div>
            </template>
            <template v-slot:cell(id)="data">
              <div class="d-flex justify-content-end">
                <router-link :to="'/order/details/'+data.item.id">
                  <b-button variant="link" class="text-warning px-1 py-0">
                    <font-awesome-icon icon="pencil-alt" title="View" />
                  </b-button>
                </router-link>
                <b-button
                  variant="link"
                  class="text-danger px-1 py-0"
                  v-if="data.item.orderStatusId == 4"
                  @click="showUpdateTrackNo(data.item.id)"
                >
                  <font-awesome-icon icon="barcode" title="Update Tracking No." />
                </b-button>

                <b-button
                  variant="link"
                  class="text-primary px-1 py-0"
                  @click="uploadSlip(data.item.id)"
                  v-if="data.item.paymentTypeId == 1 && (data.item.orderStatusId == 2 || data.item.orderStatusId == 3)"
                >
                  <font-awesome-icon icon="file-upload" title="Upload Slip" />
                </b-button>
                <b-button
                  variant="link"
                  class="text-primary px-1 py-0"
                  v-if="data.item.hadSlip == true"
                  @click="previewSlip(data.item.id,data.item.orderStatusId)"
                >
                  <font-awesome-icon icon="search" title="Preview Slip" />
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
            v-model="filter.PageNo"
            :total-rows="rows"
            :per-page="filter.PerPage"
            class="m-md-0"
            @change="pagination"
          ></b-pagination>
          <b-form-select
            @change="hanndleChangePerpage"
            v-model="filter.PerPage"
            :options="pageOptions"
          ></b-form-select>
        </b-col>
      </b-row>
    </div>

    <UploadSlipModal ref="uploadSlipModal" @getList="getList" @showPreview="showPreview" />

    <ModalAlert
      v-if="modalAlertShow"
      :msg="msgModal"
      :img="imgModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
      :hideClose="hideClose"
    />

    <UpdateTrackNoModal @getList="getList" ref="updateTrackNo" />

    <RejectSlipModal
      @showSlipModal="showSlipModal"
      @sendApproveRejectRequest="sendApproveRejectRequest"
      ref="rejectSlipModal"
    />

    <SlipDetailsModal
      @showRejectModal="showRejectModal"
      @sendApproveRejectRequest="sendApproveRejectRequest"
      ref="slipDetailsModal"
      :slip="slip"
      @showPreview="showPreview"
    />

    <ShowSlipImageModal ref="showSlipImgModal" />
  </CContainer>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";
import { required } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import UpdateTrackNoModal from "./components/UpdateTrackingNoModal";
import ShowSlipImageModal from "./components/ShowSlipImageModal";
import RejectSlipModal from "./components/RejectSlipModal";
import SlipDetailsModal from "./components/SlipDetailsModal";
import UploadSlipModal from "./components/UploadSlipModal";

export default {
  name: "Index",
  components: {
    ModalAlert,
    UpdateTrackNoModal,
    ShowSlipImageModal,
    RejectSlipModal,
    SlipDetailsModal,
    UploadSlipModal
  },
  data() {
    return {
      fields: [
        {
          key: "ids",
          label: "#"
        },
        {
          key: "receiptNo",
          label: "Order ID",
          class: "w-100px"
        },
        {
          key: "buyerName",
          label: "Buyer Name",
          class: "w-100px"
        },
        {
          key: "amount",
          label: "Amount",
          class: "text-right w-100px"
        },
        {
          key: "paymentChanel",
          label: "Payment Channel",
          class: "w-100px"
        },
        {
          key: "status",
          label: "Status"
        },
        {
          key: "updatedTime",
          label: "Last Update",
          class: "w-100px"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      items: [],
      filterList: [],
      allItems: [],
      bank: [],
      isBusy: false,
      error: false,
      selectedAll: false,
      rows: 0,
      id: 0,
      statusid: 0,
      slip: [],
      bank: [],
      hasImage: false,
      selected: [],
      errortxt: "",
      imageUrl: "",
      isUpload: false,
      modalAlertShow: false,
      imgModal: null,
      msgModal: null,
      upload: {
        transferSlip: "",
        uploadDate: "",
        transferAmount: 0,
        bankTransfer: 0
      },
      filter: {
        PaymentChanel: [],
        StartDate: "",
        EndDate: "",
        Status: [],
        Search: "",
        PageNo: 1,
        PerPage: 10,
        ExportId: []
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
    await this.getList();
    await this.getFilter();
    await this.getAllData();
  },
  watch: {
    selected: function() {
      if (this.selected.length == this.allItems.length) {
        this.selectedAll = true;
      } else {
        this.selectedAll = false;
      }
    },
    selectedAll: function() {
      if (this.selected.length != this.allItems.length) {
        if (this.selectedAll) {
          this.selected = [];
          this.allItems.forEach((element, index) => {
            this.selected.push(element.id);
          });
        }
      } else {
        if (!this.selectedAll) {
          this.selected = [];
        }
      }
    }
  },
  methods: {
    moment: function() {
      return moment();
    },
    handleCloseModal: function() {
      this.modalAlertShow = false;
    },
    showUpdateTrackNo: function(id) {
      this.$refs["updateTrackNo"].show(id);
    },
    uploadSlip: async function(id) {
      this.id = id;

      await this.getSlipData(id);

      let uploads = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/transaction/BankTransfer`,
        null,
        this.$headers,
        null
      );

      if (uploads.result == 1) {
        this.bank = [];
        let banks = uploads.detail;

        banks = await banks.map(obj => {
          return {
            value: obj.id,
            text: `${obj.accountNo} ${obj.bankName} ${obj.accountName}`
          };
        });

        this.bank = this.bank.concat(banks);

        this.$refs["uploadSlipModal"].show(this.id, this.slip, this.bank);
      }
    },
    previewSlip: async function(id, status) {
      this.$refs["slipDetailsModal"].show(id, status);

      this.statusid = status;
      this.id = id;

      this.getSlipData(id);
    },
    getSlipData: async function(id) {
      let slips = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/transaction/SlipDetail/${id}`,
        null,
        this.$headers,
        null
      );

      if (slips.result == 1) {
        this.slip = slips.detail;
      }
    },
    showPreview(value) {
      this.$refs["showSlipImgModal"].show(value);
    },
    showRejectModal: async function() {
      this.$refs["slipDetailsModal"].hide(this.id, this.statusid);
      this.$refs["rejectSlipModal"].show(this.id);
    },
    showSlipModal: async function() {
      this.$refs["slipDetailsModal"].show(this.id, this.statusid);
    },
    sendApproveRejectRequest: async function(requests) {
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/SaveOrderStatusLog`,
        null,
        this.$headers,
        requests
      );

      if (data.result == 1) {
        this.$refs["rejectSlipModal"].hide();
        this.$refs["slipDetailsModal"].hide();
        this.getList();
      }
    },
    getAllData: async function() {
      // get ข้อมูลทั้งหมดมาใช้ตอนเช็คติ้ก
      let filterAll = {
        PaymentChanel: [],
        StartDate: "",
        EndDate: "",
        Status: [],
        Search: "",
        PageNo: 1,
        PerPage: -1
      };
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/list`,
        null,
        this.$headers,
        filterAll
      );

      if (data.result == 1) {
        this.allItems = data.detail.dataList;
      }
    },
    downloadShippingLabel: async function() {
      this.filter.ExportId = this.selected;
      this.modalAlertShow = true;
      this.imgModal = "/img/loading.svg";
      this.msgModal = "In progress. Exporting Data...";
      this.isSuccess = true;
      this.hideClose = true;

      axios({
        url: `${this.$baseUrl}/api/transaction/ShippingAddressList`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: this.filter
      })
        .then(response => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var dateExcel = moment().format("DDMMYYYYhhmmss");

          this.modalAlertShow = false;

          fileLink.href = fileURL;
          fileLink.setAttribute(
            "download",
            `Shipping-Address-Label-List-` +
              dateExcel +
              `.${response.data.type.split("/").pop(-1)}`
          );
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.imgModal = "/img/icon-unsuccess.png";
            this.msgModal =
              "Internal Server Error. Please contact system administrator";
            this.hideClose = false;
          }
        });
    },
    getList: async function() {
      this.isBusy = true;
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/list`,
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
    getFilter: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/transaction/filter`,
        null,
        this.$headers,
        null
      );
      if (data.result == 1) {
        this.filterList = data.detail;
      }
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.PageNo = 1;
        this.getList();
      }
    },
    pagination(Page) {
      this.filter.PageNo = Page;
      this.getList();
    },
    getDataByStatus() {
      if (new Date(this.filter.EndDate) < new Date(this.filter.StartDate)) {
        this.error = true;
        return;
      }

      this.$refs.filterSidebar.hide();
      this.error = false;
      this.getList();
    },
    hanndleChangePerpage(value) {
      this.filter.PageNo = 1;
      this.filter.PerPage = value;
      this.getList();
    },
    exportData: async function() {
      this.filter.ExportId = this.selected;
      this.modalAlertShow = true;
      this.imgModal = "/img/loading.svg";
      this.msgModal = "In progress. Exporting Data...";
      this.isSuccess = true;
      this.hideClose = true;

      axios({
        url: `${this.$baseUrl}/api/transaction/export`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: this.filter
      })
        .then(response => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var dateExcel = moment().format("DDMMYYYYhhmmss");

          this.modalAlertShow = false;

          fileLink.href = fileURL;
          fileLink.setAttribute(
            "download",
            `Order-List-` + dateExcel + `.xlsx`
          );
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.imgModal = "/img/icon-unsuccess.png";
            this.msgModal =
              "Internal Server Error. Please contact system administrator";
            this.hideClose = false;
          }
        });
    },
    downloadTemplate: async function() {
      this.modalAlertShow = true;
      this.imgModal = "/img/loading.svg";
      this.msgModal = "In progress. Exporting Data...";
      this.isSuccess = true;
      this.hideClose = true;

      axios({
        url: `${this.$baseUrl}/api/transaction/exportTrackingTemplate`,
        method: "get",
        headers: this.$headers,
        responseType: "blob"
      })
        .then(response => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var dateExcel = moment().format("DDMMYYYYhhmmss");

          this.modalAlertShow = false;

          fileLink.href = fileURL;
          fileLink.setAttribute(
            "download",
            `Tracking-No-Template-` + dateExcel + `.xlsx`
          );
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.imgModal = "/img/icon-unsuccess.png";
            this.msgModal =
              "Internal Server Error. Please contact system administrator";
            this.hideClose = false;
          }
        });
    }
  }
};
</script>

<style scoped>
.dropdown-menu-right {
  width: 500px !important;
}

.b-contain {
  background-size: contain;
  padding-bottom: 50%;
}
</style>