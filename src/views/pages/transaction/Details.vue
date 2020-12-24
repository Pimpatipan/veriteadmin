<template>
  <div class="w-100">
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Order Details</h1>
          </b-col>
        </b-row>
        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4 vh-100" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>

          <b-col class="px-4 px-sm-5 py-4" v-else>
            <b-row>
              <b-col lg="6" class="text-lg-left order-1 order-lg-0">
                <h4 class="font-weight-bold text-center text-lg-left">
                  Order No. :
                  <span v-if="transaction.order.receiptNo != ''">{{
                    transaction.order.receiptNo
                  }}</span>
                  <span v-else>{{ transaction.order.quotationNo }}</span>
                  <font-awesome-icon
                    icon="file-invoice"
                    title="ขอใบกำกับภาษี"
                    v-if="transaction.order.requestTax"
                    class="text-primary ml-3"
                  />
                </h4>

                <b-row>
                  <b-col cols="6">
                    <p class="mb-2 mt-2 font-weight-bold">Buyer Details</p>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <router-link
                      :to="'/user/details/' + transaction.order.userGUID"
                    >
                      <b-button
                        variant="link"
                        class="text-body text-underline"
                        v-if="transaction.order.memberType != 'Guest'"
                        >View Details</b-button
                      >
                    </router-link>
                  </b-col>
                </b-row>
                <b-row class="mt-2 mb-3">
                  <b-col md="3" class="font-weight-bold">Name :</b-col>
                  <b-col class="mb-2 mb-sm-0" md="9"
                    >{{ transaction.order.firstname }}
                    {{ transaction.order.lastname }}</b-col
                  >

                  <b-col md="3" class="font-weight-bold">Tel :</b-col>
                  <b-col class="mb-2 mb-sm-0" md="9">{{
                    transaction.order.telephone
                  }}</b-col>

                  <b-col md="3" class="font-weight-bold">Email :</b-col>
                  <b-col class="mb-2 mb-sm-0" md="9">{{
                    transaction.order.email
                  }}</b-col>

                  <b-col md="3" class="font-weight-bold">Member Type :</b-col>
                  <b-col md="9">{{ transaction.order.memberType }}</b-col>
                </b-row>
              </b-col>
              <b-col
                lg="6"
                class="text-center text-lg-right order-0 order-lg-1"
              >
                <div
                  class="d-sm-flex justify-content-center justify-content-lg-end"
                >
                  <h4 class="font-weight-bold">Status :</h4>
                  <b-form-select
                    v-model="selected"
                    :class="['mb-1 statusSelect', colorSelect]"
                    ref="test"
                    :disabled="status"
                  >
                    <b-form-select-option
                      :value="item.id"
                      v-for="item in statusList"
                      v-bind:key="item.id"
                      :class="'status-' + item.id"
                      >{{ item.name }}</b-form-select-option
                    >
                  </b-form-select>
                </div>
                <p>
                  Date :
                  {{
                    new Date(transaction.order.createdTime)
                      | moment("DD/MM/YYYY HH:mm")
                  }}
                </p>
              </b-col>
            </b-row>

            <b-row class="mt-2 mx-0">
              <b-col md="6" class="pl-md-0 pr-md-1 px-0 mb-2 mb-md-0">
                <div class="border-gray p-3 h-200">
                  <b-row>
                    <b-col cols="8">
                      <p class="font-weight-bold">Shipping Address :</p>
                    </b-col>
                    <b-col cols="4" class="text-right">
                      <p
                        class="pointer text-underline"
                        @click="editAddress(transaction.order.id, 1)"
                      >
                        Edit
                      </p>
                    </b-col>
                  </b-row>

                  <div class="address-box">
                    <p>
                      {{ transaction.order.shippingAddress.firstname }}
                      {{ transaction.order.shippingAddress.lastname }}
                    </p>
                    <p>
                      {{ transaction.order.shippingAddress.address }}
                      {{ transaction.order.shippingAddress.subDistrict }}
                      {{ transaction.order.shippingAddress.district }}
                      {{ transaction.order.shippingAddress.province }}
                      {{ transaction.order.shippingAddress.code }}
                    </p>
                  </div>
                </div>
              </b-col>
              <b-col md="6" class="pr-md-0 pl-md-1 px-0">
                <div class="border-gray p-3 h-200">
                  <b-row>
                    <b-col cols="8">
                      <p class="font-weight-bold">Receipt Address :</p>
                    </b-col>
                    <b-col cols="4" class="text-right">
                      <p
                        class="pointer text-underline"
                        @click="editAddress(transaction.order.id, 2)"
                      >
                        Edit
                      </p>
                    </b-col>
                  </b-row>
                  <div class="address-box">
                    <p>
                      {{ transaction.order.billingAddress.firstname }}
                      {{ transaction.order.billingAddress.lastname }}
                    </p>
                    <p
                      class="mb-3"
                      v-if="transaction.order.billingAddress.tax != ''"
                    >
                      Tax ID :
                      <span
                        v-if="transaction.order.billingAddress.tax != null"
                        >{{ transaction.order.billingAddress.tax }}</span
                      >
                      <span v-else>-</span>
                    </p>
                    <p>
                      {{ transaction.order.billingAddress.address }}
                      {{ transaction.order.billingAddress.subDistrict }}
                      {{ transaction.order.billingAddress.district }}
                      {{ transaction.order.billingAddress.province }}
                      {{ transaction.order.billingAddress.code }}
                    </p>
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-2 mx-0">
              <b-col md="6" class="pl-md-0 pr-md-1 px-0 mb-2 mb-md-0">
                <div class="border-gray p-3">
                  <b-row>
                    <b-col cols="6">
                      <p class="font-weight-bold nobreak">Payment Details</p>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <p
                        class="text-underline pointer"
                        @click="uploadSlip(transaction.order.id)"
                        v-if="
                          transaction.order.paymentTypeId == 1 &&
                          (transaction.order.orderStatusId == 2 ||
                            transaction.order.orderStatusId == 3)
                        "
                      >
                        Upload Slip
                      </p>
                    </b-col>
                  </b-row>

                  <b-row class="address-box">
                    <b-col sm="4" class="font-weight-bold"
                      >Payment Ref. :</b-col
                    >
                    <b-col sm="8">
                      <p class="float-left">
                        <span v-if="transaction.order.paymentRef != null">{{
                          transaction.order.paymentRef
                        }}</span>
                        <span v-else>-</span>
                      </p>
                      <p
                        v-if="transaction.order.hadSlip == true"
                        class="float-right text-underline pointer"
                        @click="
                          previewSlip(
                            transaction.order.id,
                            transaction.order.orderStatusId
                          )
                        "
                      >
                        Slip Preview
                      </p>
                    </b-col>

                    <b-col sm="4" class="font-weight-bold">Pay via :</b-col>
                    <b-col sm="8">
                      <p class="float-left">
                        {{ transaction.order.paymentChanelName }}
                      </p>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
              <b-col md="6" class="pr-md-0 pl-md-1 px-0">
                <div class="border-gray p-3">
                  <b-row>
                    <b-col cols="7">
                      <p class="font-weight-bold">Shipping Details</p>
                    </b-col>
                    <b-col cols="5" class="text-right">
                      <font-awesome-icon
                        icon="file-download"
                        class="main-color pointer"
                        title="Download Shipping Label"
                        v-if="
                          transaction.order.orderStatusId == 4 ||
                          transaction.order.orderStatusId == 1
                        "
                        @click="downloadShippingAddress"
                      />
                    </b-col>
                  </b-row>
                  <b-row class="address-box">
                    <b-col sm="4" class="font-weight-bold"
                      >Tracking No. :</b-col
                    >
                    <b-col sm="8">
                      <p
                        class="float-left"
                        v-if="transaction.order.trackingNo != null"
                      >
                        {{ transaction.order.trackingNo }}
                      </p>
                      <p class="float-left" v-else>-</p>
                      <p
                        class="float-right text-underline pointer"
                        @click="showUpdateTrackNo(transaction.order.id)"
                        v-if="
                          transaction.order.orderStatusId == 4 ||
                          transaction.order.orderStatusId == 1
                        "
                      >
                        Edit
                      </p>
                    </b-col>

                    <b-col sm="4" class="font-weight-bold">Send via :</b-col>
                    <b-col sm="8">
                      <p class="float-left">
                        {{ transaction.order.shippingTypeName }}
                      </p>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
            </b-row>

            <div class="my-4">
              <h4 class="font-weight-bold">Order Details</h4>
            </div>

            <div class="w-100">
              <b-table
                striped
                responsive
                :items="itemsOrder"
                :fields="fieldsOrder"
                show-empty
                empty-text="No matching records found"
              >
                <template v-slot:cell(productImageUrl)="data">
                  <div
                    class="image-preview"
                    v-bind:style="{
                      'background-image':
                        'url(' + data.item.productImageUrl + ')',
                    }"
                  ></div>
                </template>
                <template v-slot:cell(productName)="data">
                  <p class="m-0 font-weight-bold nobreak">
                    {{ data.item.productName }}
                  </p>
                  <!-- <p class="m-0 nobreak">{{data.item.productShortDescription}}</p> -->
                  <p class="m-0 nobreak">
                    <span
                      class="font-weight-bold"
                      v-if="data.item.promocodeName != null"
                    >
                      Promotion :
                      {{ data.item.promocodeName }}
                    </span>
                    <span class="font-weight-bold" v-else>Promotion : -</span>
                  </p>
                </template>
                <template v-slot:cell(subtotal)="data">
                  <p class="m-0">
                    {{ data.item.subtotal | numeral("0,0.00") }}
                  </p>
                </template>
                <template v-slot:cell(discount)="data">
                  <p class="m-0">
                    {{ data.item.discount | numeral("0,0.00") }}
                  </p>
                </template>
                <template v-slot:cell(grandTotal)="data">
                  <p class="m-0">
                    {{ data.item.grandTotal | numeral("0,0.00") }}
                  </p>
                </template>
              </b-table>
            </div>

            <b-row>
              <b-col sm="6" offset-md="6">
                <div class="border-gray p-3">
                  <b-row class="pb-2">
                    <b-col cols="7">Quantity</b-col>
                    <b-col cols="5" class="font-weight-bold text-right"
                      >{{ transaction.order.productQuantity }} pcs</b-col
                    >
                  </b-row>
                  <b-row class="pb-2">
                    <b-col cols="7">Total</b-col>
                    <b-col cols="5" class="font-weight-bold text-right"
                      >{{
                        transaction.order.subtotal | numeral("0,0.00")
                      }}
                      Baht</b-col
                    >
                  </b-row>
                  <b-row
                    class="pb-2 sub-color"
                    v-if="transaction.order.discount != 0"
                  >
                    <b-col cols="7">Discount</b-col>
                    <b-col cols="5" class="font-weight-bold text-right"
                      >{{
                        transaction.order.discount | numeral("0,0.00")
                      }}
                      Baht</b-col
                    >
                  </b-row>
                  <b-row class="pb-2">
                    <b-col cols="7">Delivery fee</b-col>
                    <b-col
                      cols="5"
                      class="font-weight-bold text-right"
                      v-if="transaction.order.shippingCost != 0"
                      >{{
                        transaction.order.shippingCost | numeral("0,0.00")
                      }}
                      Baht</b-col
                    >
                    <b-col cols="5" class="font-weight-bold text-right" v-else
                      >Free</b-col
                    >
                  </b-row>
                  <b-row
                    class="pb-2"
                    v-if="transaction.order.shippingDiscount != 0"
                  >
                    <b-col cols="7">Shipping discount promo (abc123)</b-col>
                    <b-col cols="5" class="font-weight-bold text-right"
                      >{{
                        transaction.order.shippingDiscount | numeral("0,0.00")
                      }}
                      Baht</b-col
                    >
                  </b-row>
                  <b-row class="pb-2">
                    <b-col cols="7">Grand total</b-col>
                    <b-col cols="5" class="font-weight-bold text-right"
                      >{{
                        transaction.order.grandTotal | numeral("0,0.00")
                      }}
                      Baht</b-col
                    >
                  </b-row>
                </div>
              </b-col>
            </b-row>

            <HeaderLine text="Log Status" class="my-4" />

            <div>
              <b-table
                striped
                responsive
                hover
                :items="items"
                :fields="fields"
                show-empty
                empty-text="No matching records found"
              >
                <template v-slot:cell(createdTime)="data">
                  <span>{{
                    new Date(data.item.createdTime)
                      | moment("DD MMM YYYY (HH:mm)")
                  }}</span>
                </template>
              </b-table>
            </div>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button
                  href="/order"
                  class="btn-details-set"
                  :disabled="isDisableBtn"
                  >CANCEL</b-button
                >
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="changeStatus(0)"
                  :disabled="isDisableBtn"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="changeStatus(1)"
                  :disabled="isDisableBtn"
                >
                  Save & Exit
                </button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </form>

    <UpdateTrackNoModal @getList="getData" ref="updateTrackNo" />

    <RejectSlipModal
      @showSlipModal="showSlipModal"
      @sendApproveRejectRequest="sendApproveRejectRequest"
      ref="rejectSlipModal"
    />

    <UploadSlipModal
      ref="uploadSlipModal"
      @getList="getData"
      @showPreview="showPreview"
    />

    <ShowSlipImageModal ref="showSlipImgModal" />

    <ModalSuccess
      v-if="modalAlertShow"
      :msg="msgModal"
      :text="textModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
    />

    <ModalAlert
      v-if="modalAlertShows"
      :msg="msgModals"
      :img="imgModals"
      :isOpen="modalAlertShows"
      @close="modalAlertShows = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
      :hideClose="hideClose"
    />

    <SlipDetailsModal
      @showRejectModal="showRejectModal"
      @sendApproveRejectRequest="sendApproveRejectRequest"
      ref="slipDetailsModal"
      :slip="slip"
       @showPreview="showPreview"
    />

    <AddressModal ref="changeAddressModal" @getList="getData" />
  </div>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";
import { required, numeric, minValue } from "vuelidate/lib/validators";
import ModalSuccess from "@/components/ModalSuccess";
import ModalAlert from "@/components/ModalAlert";
import UpdateTrackNoModal from "./components/UpdateTrackingNoModal";
import ShowSlipImageModal from "./components/ShowSlipImageModal";
import RejectSlipModal from "./components/RejectSlipModal";
import SlipDetailsModal from "./components/SlipDetailsModal";
import UploadSlipModal from "./components/UploadSlipModal";
import AddressModal from "@/components/user/AddressModal";
import HeaderLine from "@/components/HeaderLine";

export default {
  name: "OrderDetails",
  components: {
    ModalSuccess,
    ModalAlert,
    UpdateTrackNoModal,
    ShowSlipImageModal,
    RejectSlipModal,
    SlipDetailsModal,
    UploadSlipModal,
    AddressModal,
    HeaderLine,
  },
  data() {
    return {
      imageUrl: "",
      flag: 0,
      items: [],
      itemsOrder: [],
      slip: [],
      bank: [],
      selected: [],
      statusList: [],
      trackNo: {},
      requests: {},
      isDisables: true,
      isDisableBtn: false,
      isLoadingData: false,
      isSuccess: false,
      isApprove: false,
      modalAlertShow: false,
      modalAlertShows: false,
      imgModals: null,
      msgModals: null,
      status: false,
      msgModal: null,
      textModal: null,
      note: "",
      statusColor: "",
      id: this.$route.params.id,
      fields: [
        {
          key: "createdTime",
          label: "Date/Time",
          class: "w-100px",
        },
        {
          key: "orderSatusName",
          label: "Status/Note",
          class: "w-100px",
        },
        {
          key: "updatedByName",
          label: "Updated By",
          class: "w-100px",
        },
        {
          key: "note",
          label: "Note",
          class: "w-100px",
        },
      ],
      fieldsOrder: [
        {
          key: "productImageUrl",
          label: "",
          class: "w-200",
        },
        {
          key: "productName",
          label: "Product Name",
          tdClass: "text-left w-200",
          thclass: "w-200",
        },
        {
          key: "subtotal",
          label: "Unit Price",
          class: "w-100px",
        },
        {
          key: "orderItemQuantity",
          label: "Qty.",
        },
        {
          key: "discount",
          label: "Discount",
          class: "w-100px",
        },
        {
          key: "grandTotal",
          label: "Net",
          class: "w-100px",
        },
      ],
      transaction: {
        order: {
          productQuantity: 0,
          statusName: null,
          paymentChanelName: null,
          shippingTypeName: null,
          shippingAddress: {
            addressTypeName: "Shipping Address",
            orderId: 0,
            addressTypeId: 1,
            firstname: "",
            lastname: null,
            address: "",
            zipCodeId: 0,
            tax: null,
          },
          billingAddress: {
            addressTypeName: "",
            orderId: 0,
            addressTypeId: 2,
            firstname: "",
            lastname: null,
            address: "",
            zipCodeId: 0,
            tax: "",
          },
          id: 0,
          userGUID: null,
          email: null,
          telephone: null,
          orderStatusId: 0,
          quotationNo: null,
          receiptNo: null,
          subtotal: 0.0,
          discount: 0.0,
          beforeVat: 0.0,
          afterVat: 0.0,
          shippingCost: 0.0,
          shippingDiscount: 0.0,
          grandTotal: 0.0,
          shippingTypeId: 0,
          trackingNo: null,
          paymentTypeId: 0,
          paymentRef: null,
          paymentTime: null,
        },
        orderItemList: [],
        orderStatusLogList: [],
      },
      upload: {
        transferSlip: "",
        uploadDate: "",
        transferAmount: 0,
        bankTransfer: 0,
      },
    };
  },
  computed: {
    colorSelect: function () {
      if (this.selected == 1) {
        return "text-success";
      } else if (this.selected == 2) {
        return "txt-purple";
      } else if (this.selected == 4) {
        return "text-primary";
      } else if (this.selected >= 5) {
        return "text-danger";
      } else {
        return "text-warning";
      }
    },
  },
  created: async function () {
    await this.getData();
    await this.checkStatus();
  },
  methods: {
    moment: function () {
      return moment();
    },
    checkStatus: function (evt) {
      var status = this.selected;
      if (status == 1 || status == 6 || status == 7) {
        this.status = true;
      } else {
        this.status = false;
      }
    },
    setStatusColor: function () {
      if (this.transaction.order.orderStatusId == 1) {
        this.statusColor = "text-success";
      } else if (this.transaction.order.orderStatusId > 5) {
        this.statusColor = "text-danger";
      } else {
        this.statusColor = "text-warning";
      }
    },
    showUpdateTrackNo: function (id) {
      this.$refs["updateTrackNo"].show(id);
    },
    getData: async function () {
      this.isLoadingData = true;

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/transaction/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.transaction = data.detail;
        this.items = data.detail.orderStatusLogList;
        this.itemsOrder = data.detail.orderItemList;

        this.isLoadingData = false;
      }

      let slips = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/transaction/SlipDetail/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (slips.result == 1) {
        this.slip = slips.detail;
      }

      if (
        this.transaction.order.orderStatusId == 2 ||
        this.transaction.order.orderStatusId == 3
      ) {
        let uploads = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/transaction/BankTransfer`,
          null,
          this.$headers,
          null
        );

        if (uploads.result == 1) {
          let banks = uploads.detail;

          banks = banks.map((obj) => {
            return {
              value: obj.id,
              text: `${obj.accountNo} ${obj.bankName} ${obj.accountName}`,
            };
          });

          this.bank = this.bank.concat(banks);
        }
      }

      let status = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/transaction/StatusList`,
        null,
        this.$headers,
        null
      );

      if (status.result == 1) {
        this.statusList = status.detail;
        this.selected = this.transaction.order.orderStatusId;
      }
    },
    uploadSlip: async function (id) {
      this.$refs["uploadSlipModal"].show(this.id, this.slip, this.bank);
    },
    previewSlip: async function (id, status) {
      this.$refs["slipDetailsModal"].show(id, status);
    },
    showRejectModal: async function () {
      this.$refs["slipDetailsModal"].hide();
      this.$refs["rejectSlipModal"].show(this.id);
    },
    showSlipModal: async function () {
      this.$refs["rejectSlipModal"].hide();
      this.$refs["slipDetailsModal"].show(
        this.id,
        this.transaction.order.orderStatusId
      );
    },
    sendApproveRejectRequest: async function (requests) {
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
        this.getData();
      }
    },
    downloadShippingAddress: async function () {
      this.modalAlertShows = true;
      this.imgModals = "/img/loading.svg";
      this.msgModals = "In progress. Exporting Data...";
      this.isSuccess = true;
      this.hideClose = true;

      axios({
        url: `${this.$baseUrl}/api/transaction/ShippingAddress/${this.id}`,
        method: "GET",
        headers: this.$headers,
        responseType: "blob",
      })
        .then((response) => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var dateExcel = moment().format("DDMMYYYYhhmmss");

          this.modalAlertShows = false;

          fileLink.href = fileURL;
          fileLink.setAttribute(
            "download",
            `Shipping-Address-Label-${this.id}-` +
              dateExcel +
              `.${response.data.type.split("/").pop(-1)}`
          );
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.imgModals = "/img/icon-unsuccess.png";
            this.msgModals =
              "Internal Server Error. Please contact system administrator";
            this.hideClose = false;
          }
        });
    },
    showPreview(value) {
      this.$refs["showSlipImgModal"].show(value);
    },
    changeStatus: async function (flag) {
      this.isDisableBtn = true;
      this.modalAlertShows = false;
      this.flag = flag;

      this.requestData = {
        OrderId: this.transaction.order.id,
        OrderStatusId: this.selected,
        Note: "",
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/SaveOrderStatusLog`,
        null,
        this.$headers,
        this.requestData
      );

      this.modalAlertShows = true;
      if (data.result == 1) {
        this.imgModals = "/img/icon-check-green.png";
        this.msgModals = data.message;
        this.isSuccess = true;
      } else {
        this.imgModals = "/img/icon-unsuccess.png";
        this.msgModals = data.message;
        this.isSuccess = false;
      }
      this.isDisableBtn = false;
    },
    handleCloseModal: function () {
      this.modalAlertShows = false;
      if (this.flag == 1) {
        window.location.href = "/order";
      } else {
        if (this.id > 0) {
          this.getData();
          this.checkStatus();
        } else {
          window.location.href = "/order";
        }
      }
    },
    editAddress: async function (orderid, id) {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/transaction/OrderAddress/${orderid}/${id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.addressDetail = data.detail;
      }

      this.$refs["changeAddressModal"].show(this.addressDetail);
    },
  },
};
</script>

<style scoped>
.sub-color {
  color: #c9b67e;
}

.b-contain {
  background-size: contain;
  padding-bottom: 50%;
}

.pt-100 {
  padding-top: 100%;
}

.slip-details {
  line-height: 25px;
}

.address-box p {
  margin: 0;
}

.address-box {
  line-height: 25px;
}

.input-disabled {
  width: 50px;
}

.h-200 {
  min-height: 200px;
}

.pab-0,
.pab {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.right-0 {
  right: 15px;
}

.f-17 {
  font-size: 17px;
}

.order-desc {
  font-size: 13px;
  color: #6b6b6b;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.order-discount {
  color: #c9b67e;
  font-size: 13px;
}

.border-gray {
  border: 1px solid #dcdcdc;
  padding: 15px 0;
}

.delete-order {
  clear: both;
  text-align: right;
}

.image-preview {
  padding-top: 50%;
  width: 50%;
  margin: auto;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.status-1 {
  color: #2eb85c !important;
}

.status-2,
.status-3,
.status-4 {
  color: #f9b115 !important;
}

.status-5,
.status-6,
.status-7 {
  color: #e55353 !important;
}

.statusSelect {
  border: 0;
  width: 235px;
  font-size: 20px;
  font-weight: bold;
  height: auto;
  padding-top: 0;
  position: relative;
  left: 10px;
  text-align-last: right;
  top: -2px;
  -webkit-appearance: none;
}

@media (max-width: 992px) {
  .pab-0 {
    position: unset;
    width: auto;
  }

  .input-disabled {
    float: right;
  }

  .statusSelect {
    text-align-last: center;
  }
}
</style>