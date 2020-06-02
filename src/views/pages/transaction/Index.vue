<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol md="6" class="text-center text-md-left">
        <h1 class="mr-sm-4">ORDER MANAGEMENT</h1>
      </CCol>
      <CCol md="6" class="text-center text-md-right">
        <b-dropdown id="dropdown-1" class="m-md-2 btn-mains small-dropdown medium-dd" right no-flip>
          <template v-slot:button-content>ACTION</template>
          <b-dropdown-item @click="exportData">Export Data</b-dropdown-item>
          <b-dropdown-item @click="downloadShippingLabel">Download Shipping Label</b-dropdown-item>
        </b-dropdown>
        <b-dropdown id="dropdown-form" right ref="dropdown" class="my-2 btn-filter w-500" no-flip>
          <template v-slot:button-content>
            <font-awesome-icon icon="filter" class="mr-2" />FILTER
          </template>
          <div>
            <p class="font-weight-bold mb-2">Order Status</p>
          </div>

          <div class="row">
            <div class="col-6" v-for="status in filterList.orderStatusList" :key="status.id">
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
            <p class="font-weight-bold my-2">Payment Type</p>
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

          <div class="row">
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
              <datetime
                v-model="filter.EndDate"
                placeholder="Please select date"
                class="date-filter"
              ></datetime>
            </div>
          </div>

          <p class="text-danger text-center my-3" v-if="error">Please enter correct date</p>

          <div class="text-center mt-3">
            <button type="button" class="btn btn-primary button" @click="getDataByStatus()">Submit</button>
          </div>
        </b-dropdown>
        <button type="button" class="btn btn-success button d-none">CREATE NEW</button>
      </CCol>
    </CRow>
    <div class="bg-white-border px-4 px-sm-5 py-4 mt-4">
      <b-row class="no-gutters mt-3">
        <b-col md="7">
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
      <b-row>
        <b-col class="mt-4">
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
              <div v-if="data.item.receiptNo != ''">{{data.item.receiptNo}}</div>
              <div v-else>{{data.item.quotationNo}}</div>
            </template>
            <template v-slot:cell(status)="data">
              <div v-if="data.item.orderStatusId == 1" class="text-success">{{data.item.status}}</div>
              <div v-else-if="data.item.orderStatusId >5" class="text-danger">{{data.item.status}}</div>
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
                <p class="m-0">{{ data.item.amount | numeral('0,0.00') }}</p>
              </div>
            </template>
            <template v-slot:cell(id)="data">
              <div class="d-flex justify-content-center">
                <router-link :to="'/order/details/'+data.item.id">
                  <b-button variant="link" class="text-warning px-1 py-0">
                    <font-awesome-icon icon="eye" title="View" />
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
                  v-if="data.item.hadSlip == true"
                  @click="previewSlip(data.item.id,data.item.orderStatusId)"
                >
                  <font-awesome-icon icon="search" title="Preview Slip" />
                </b-button>
                <b-button
                  variant="link"
                  class="text-primary px-1 py-0"
                  @click="uploadSlip(data.item.id)"
                  v-if="data.item.paymentTypeId == 1 && (data.item.orderStatusId == 2 || data.item.orderStatusId == 3)"
                >
                  <font-awesome-icon icon="file-upload" title="Upload Slip" />
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
    <b-modal
      id="updateTrackNo"
      ref="updateTrackNo"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Update Tracking No.</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('updateTrackNo')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <InputText
                textFloat="Tracking No."
                placeholder="Tracking No."
                type="text"
                name="trackNo"
                isRequired
                v-model="trackno"
                @onKeyup="handleChangeBtn"
              />
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-3">
        <b-button
          class="btn btn-main float-right"
          :disabled="isDisable"
          @click="updateTrackingNo"
        >Submit</b-button>
        <b-button class="btn btn-sub float-left" @click="$bvModal.hide('updateTrackNo')">Close</b-button>
      </div>
    </b-modal>

    <b-modal
      id="slipDetailsModal"
      ref="slipDetailsModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
      size="lg"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Slip Details</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('slipDetailsModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col cols="6" class="slip-details">
              <b-row>
                <b-col lg="6" class="font-weight-bold">Transfer to :</b-col>
                <b-col lg="6">{{slip.transferTo}}</b-col>
              </b-row>

              <b-row>
                <b-col lg="6" class="font-weight-bold">Amount to be paid :</b-col>
                <b-col lg="6">{{slip.amountToBePaid | numeral('0,0.00')}}</b-col>
              </b-row>
            </b-col>
            <b-col cols="6" class="slip-details">
              <b-row>
                <b-col lg="6" class="font-weight-bold">Date / time :</b-col>
                <b-col lg="6">{{ new Date(slip.paymentTime) | moment("DD/MM/YYYY HH:mm") }}</b-col>
              </b-row>
              <b-row>
                <b-col lg="6" class="font-weight-bold">Amount transfer :</b-col>
                <b-col lg="6">{{slip.amountTransfer | numeral('0,0.00')}}</b-col>
              </b-row>
            </b-col>

            <b-col>
              <p class="font-weight-bold my-3 text-center">Slip Preview</p>
              <div
                class="preview-box preview-box-slip"
                v-bind:style="{ 'background-image': 'url(' + slip.imageUrl + ')' }"
              ></div>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-5" v-if="statusid == 3">
        <b-button
          class="btn btn-main float-right"
          @click="sendApproveRejectRequest(4)"
          :disabled="isApprove"
        >Approve</b-button>
        <b-button class="btn btn-sub float-left" @click="showRejectModal">Reject</b-button>
      </div>
    </b-modal>

    <b-modal
      id="rejectSlipModal"
      ref="rejectSlipModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Reject Slip</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('rejectSlipModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <InputTextArea
                textFloat="Note to customer"
                placeholder="Note to customer"
                type="text"
                name="reject"
                v-model="note"
                @onKeyup="handleChangeBtns"
              />
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-3">
        <b-button
          class="btn btn-main float-right"
          :disabled="isDisables"
          @click="sendApproveRejectRequest(2)"
        >Submit</b-button>
        <b-button class="btn btn-sub float-left" @click="showSlipModal" :disabled="isDisables">Back</b-button>
      </div>
    </b-modal>

    <b-modal
      id="uploadSlipModal"
      ref="uploadSlipModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Upload Slip</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('uploadSlipModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <UploadFile
                textFloat="Pay-in slip"
                placeholder="Please choose file"
                format="all"
                :fileName="imageUrl"
                v-model="upload.transferSlip"
                name="thumbnail"
                text="*Please upload only file *.jpg , *.png and less than 10 MB"
                isRequired
                v-on:onFileChange="onImageChange"
                v-on:delete="deleteImage"
                :v="$v.upload.transferSlip"
              />
              <div
                :class="['preview-box b-contain', { pointer: hasImage }]"
                v-bind:style="{ 'background-image': 'url(' + upload.transferSlip + ')' }"
                @click="showPreview"
              ></div>

              <InputText
                textFloat="Transfer Amount"
                placeholder="Transfer Amount"
                type="number"
                name="transferamount"
                isRequired
                v-model="upload.transferAmount"
                :isValidate="$v.upload.transferAmount.$error"
                :v="$v.upload.transferAmount"
                @onKeypress="isNumber($event)"
              />

              <label class="label-text">
                Date / time transfer
                <span class="text-danger">*</span>
              </label>
              <datetime
                v-model="upload.uploadDate"
                placeholder="Please select date"
                class="date-picker"
                format="dd MMM yyyy HH:mm"
                type="datetime"
                :isValidate="$v.upload.uploadDate.$error"
                :v="$v.upload.uploadDate"
              ></datetime>
              <div :class="[{'mb-3' : $v.upload.uploadDate.$error }]">
                <span
                  v-if="$v.upload.uploadDate.$error"
                  class="text-danger mb-3"
                >This field can’t be empty</span>
              </div>

              <InputSelect
                title="Transfer to (Banks)"
                name="transferFromBank"
                v-model="upload.bankTransfer"
                isRequired
                :isValidate="$v.upload.bankTransfer.$error"
                :v="$v.upload.bankTransfer"
                v-bind:options="bank"
                valueField="value"
                textField="text"
                @onDataChange="handleChangeSourceBank"
              />

              <p class="text-danger text-center">{{errortxt}}</p>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-3">
        <b-button class="btn btn-main" @click="checkModal" :disabled="isUpload">Submit</b-button>
      </div>
    </b-modal>

    <b-modal
      id="showSlipImgModal"
      ref="showSlipImgModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
      size="xl"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Slip Image Preview</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('showSlipImgModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <div
                class="preview-box b-contain"
                v-bind:style="{ 'background-image': 'url(' + upload.transferSlip + ')' }"
              ></div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>
  </CContainer>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";
import { required, numeric, minValue } from "vuelidate/lib/validators";
import UploadFile from "@/components/inputs/UploadFile";
import InputSelect from "@/components/inputs/InputSelect";

export default {
  name: "Index",
  components: {
    InputText,
    InputTextArea,
    UploadFile,
    InputSelect
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
          class: "w-100px"
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
      isBusy: false,
      error: false,
      selectedAll: false,
      rows: 0,
      id: 0,
      statusid: 0,
      selectStatus: [],
      slip: [],
      bank: [],
      hasImage: false,
      selected: [],
      selectPayment: [],
      statusColor: "",
      errortxt: "",
      imageUrl: "",
      trackno: "",
      note: "",
      isDisable: true,
      isDisables: true,
      isApprove: false,
      isUpload: false,
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
      upload: {
        transferSlip: "",
        uploadDate: "",
        transferAmount: 0,
        bankTransfer: 0
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ]
    };
  },
  validations: {
    upload: {
      transferSlip: { required },
      uploadDate: { required },
      transferAmount: { required },
      bankTransfer: { required }
    }
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
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode == 101 || charCode == 45 || charCode == 43) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    handleChangeSourceBank: async function(value) {
      this.upload.bankTransfer = value;
    },
    showUpdateTrackNo: function(id) {
      this.$refs["updateTrackNo"].show();
      this.id = id;
    },
    getBase64Image(image) {
      var result = "";
      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = image;
      return new Promise(resolve => {
        img.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          //dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
          resolve(dataURL);
        };
      });
    },
    setImageBase64: async function(img) {
      let result = await this.getBase64Image(img);
      this.upload.transferSlip = result;
      if (this.slip.imageUrl != null) {
        this.imageUrl = img;
      }
      this.hasImage = true;
    },
    onImageChange(img) {
      this.imageUrl = img.name;
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => {
        this.upload.transferSlip = reader.result;
      };
      this.hasImage = true;
    },
    deleteImage(value) {
      this.upload.transferSlip = "";
      this.imageUrl = "";
      this.hasImage = false;
    },
    uploadSlip: async function(id) {
      this.$refs["uploadSlipModal"].show();
      this.id = id;

      this.getSlipData(id);

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

        banks = banks.map(obj => {
          return {
            value: obj.id,
            text: `${obj.accountNo} ${obj.bankName} ${obj.accountName}`
          };
        });

        this.bank = this.bank.concat(banks);

        if (this.slip.orderId > 0) {
          this.upload.bankTransfer = this.slip.bankId;
        } else {
          this.upload.bankTransfer = this.bank[0].value;
        }
      }
    },
    previewSlip: async function(id, status) {
      this.$refs["slipDetailsModal"].show();

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
        if (this.slip.orderId > 0) {
          this.upload.transferAmount = this.slip.amountTransfer;
          this.upload.uploadDate = this.slip.paymentTime;
          this.upload.bankTransfer = this.slip.bankId;
          this.imageUrl = this.slip.imageUrl;
          this.setImageBase64(this.slip.imageUrl);
        } else {
          this.upload.transferAmount = 0;
          this.upload.uploadDate = "";
          this.upload.transferSlip = "";
          this.upload.bankTransfer = 1;
          this.imageUrl = "";
        }
      }

      this.$v.upload.$reset();
    },
    showPreview(e) {
      if (this.upload.transferSlip != "") {
        this.$refs["showSlipImgModal"].show();
      } else {
        e.preventDefault();
      }
    },
    checkModal: async function() {
      this.$v.upload.$touch();
      if (this.$v.upload.$error) {
        return;
      }

      this.$v.upload.$reset();
      this.isUpload = true;

      let uploadData = {
        OrderId: this.id,
        Amount: this.upload.transferAmount,
        TransferTime: moment(this.upload.uploadDate).format(
          "YYYY-MM-DD[T]HH:mm:ss"
        ),
        ImageSlip: this.upload.transferSlip,
        BankAccountId: this.upload.bankTransfer
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/UploadSlip`,
        null,
        this.$headers,
        uploadData
      );

      if (data.result == 1) {
        this.$refs["uploadSlipModal"].hide();

        // this.upload.transferAmount = 0;
        // this.upload.uploadDate = "";
        // this.upload.transferSlip = "";
        // this.upload.bankTransfer = 0;
        // this.imageUrl = "";
        this.isUpload = false;
        this.errortxt = "";
        //location.reload();
        this.getList();
      } else {
        this.isUpload = false;
        this.errortxt = data.message;
      }
    },
    showRejectModal: async function() {
      this.$refs["slipDetailsModal"].hide();
      this.$refs["rejectSlipModal"].show();
    },
    showSlipModal: async function() {
      this.$refs["rejectSlipModal"].hide();
      this.$refs["slipDetailsModal"].show();
    },
    sendApproveRejectRequest: async function(statusId) {
      this.requests = {
        OrderId: this.id,
        OrderStatusId: statusId,
        Note: this.note
      };

      this.isApprove = true;
      this.isDisables = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/SaveOrderStatusLog`,
        null,
        this.$headers,
        this.requests
      );

      if (data.result == 1) {
        this.$refs["rejectSlipModal"].hide();
        this.$refs["slipDetailsModal"].hide();
        this.isApprove = false;
        this.isDisables = false;
        this.getList();
      }
    },
    handleChangeBtn: function() {
      if (this.trackno == "") {
        this.isDisable = true;
      } else {
        this.isDisable = false;
      }
    },
    handleChangeBtns: function() {
      if (this.note != null) {
        this.isDisables = false;
      } else {
        this.isDisables = true;
      }
    },
    getAllData: async function() {
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

      axios({
        url: `${this.$baseUrl}/api/transaction/ShippingAddressList`,
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
          `Shipping-Address-Label-List-` +
            dateExcel +
            `.${response.data.type.split("/").pop(-1)}`
        );
        document.body.appendChild(fileLink);
        fileLink.click();
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
    updateTrackingNo: async function() {
      this.isDisable = true;

      let trackNo = {
        OrderId: this.id,
        TrackingNo: this.trackno
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/UpdateTrackingNo`,
        null,
        this.$headers,
        trackNo
      );

      if (data.result == 1) {
        this.$refs["updateTrackNo"].hide();
        this.getList();
      }

      this.isDisable = false;
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

      this.$refs.dropdown.hide(true);
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

      axios({
        url: `${this.$baseUrl}/api/transaction/export`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: this.filter
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var dateExcel = moment().format("DDMMYYYYhhmmss");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", `Order-List-` + dateExcel + `.xlsx`);
        document.body.appendChild(fileLink);
        fileLink.click();
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