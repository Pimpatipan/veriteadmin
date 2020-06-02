<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Order Details</h1>
          </b-col>
        </b-row>
        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>

          <b-col class="px-4 px-sm-5 py-4" v-else>
            <b-row>
              <b-col lg="6" class="text-lg-left order-1 order-lg-0">
                <h4 class="font-weight-bold text-center text-lg-left">
                  Order No. :
                  <span
                    v-if="transaction.order.receiptNo != ''"
                  >{{transaction.order.receiptNo}}</span>
                  <span v-else>{{transaction.order.quotationNo}}</span>
                </h4>

                <b-row>
                  <b-col cols="6">
                    <p class="mb-2 mt-2 font-weight-bold">Buyer Details</p>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <router-link :to="'/user/details/'+transaction.order.userGUID">
                      <b-button
                        variant="link"
                        class="text-body text-underline"
                        v-if="transaction.order.memberType != 'Guest'"
                      >View Details</b-button>
                    </router-link>
                  </b-col>
                </b-row>
                <b-row class="mt-2 mb-3">
                  <b-col  md="3" class="font-weight-bold">Name :</b-col>
                  <b-col
                   class="mb-2 mb-sm-0"
                    md="9"
                  >{{transaction.order.firstname}} {{transaction.order.lastname}}</b-col>

                  <b-col  md="3" class="font-weight-bold">Tel :</b-col>
                  <b-col class="mb-2 mb-sm-0" md="9">{{transaction.order.telephone}}</b-col>

                  <b-col  md="3" class="font-weight-bold">Email :</b-col>
                  <b-col class="mb-2 mb-sm-0" md="9">{{transaction.order.email}}</b-col>

                  <b-col  md="3" class="font-weight-bold">Member Type :</b-col>
                  <b-col  md="9">{{transaction.order.memberType}}</b-col>
                </b-row>
              </b-col>
              <b-col lg="6" class="text-center text-lg-right order-0 order-lg-1">
                <div class="d-sm-flex justify-content-center justify-content-lg-end">
                  <h4 class="font-weight-bold">Status :</h4>
                  <b-form-select
                    v-model="selected"
                    :class="['mb-1 statusSelect', colorSelect]"
                    @change="changeStatus"
                    ref="test"
                  >
                    <b-form-select-option
                      :value="item.id"
                      v-for="item in statusList"
                      v-bind:key="item.id"
                      :class="'status-'+item.id"
                    >{{item.name}}</b-form-select-option>
                  </b-form-select>
                </div>
                <p>Date : {{ new Date(transaction.order.createdTime) | moment("DD/MM/YYYY HH:mm") }}</p>
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
                        @click="editAddress(transaction.order.id,1)"
                      >Edit</p>
                    </b-col>
                  </b-row>

                  <div class="address-box">
                    <p>{{transaction.order.shippingAddress.firstname}} {{transaction.order.shippingAddress.lastname}}</p>
                    <p>{{transaction.order.shippingAddress.address}} {{transaction.order.shippingAddress.subDistrict}} {{transaction.order.shippingAddress.district}} {{transaction.order.shippingAddress.province}} {{transaction.order.shippingAddress.code}}</p>
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
                        @click="editAddress(transaction.order.id,2)"
                      >Edit</p>
                    </b-col>
                  </b-row>
                  <div class="address-box">
                    <p>{{transaction.order.billingAddress.firstname}} {{transaction.order.billingAddress.lastname}}</p>
                    <p class="mb-3" v-if="transaction.order.billingAddress.tax != ''">
                      Tax ID :
                      <span
                        v-if="transaction.order.billingAddress.tax != null"
                      >{{transaction.order.billingAddress.tax}}</span>
                      <span v-else>-</span>
                    </p>
                    <p>{{transaction.order.billingAddress.address}} {{transaction.order.billingAddress.subDistrict}} {{transaction.order.billingAddress.district}} {{transaction.order.billingAddress.province}} {{transaction.order.billingAddress.code}}</p>
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
                        @click="$bvModal.show('uploadSlipModal')"
                        v-if="transaction.order.paymentTypeId == 1 && (transaction.order.orderStatusId == 2 || transaction.order.orderStatusId == 3)"
                      >Upload Slip</p>
                    </b-col>
                  </b-row>

                  <b-row class="address-box">
                    <b-col sm="4" class="font-weight-bold">Payment Ref. :</b-col>
                    <b-col sm="8">
                      <p class="float-left">
                        <span
                          v-if="transaction.order.paymentRef != null"
                        >{{transaction.order.paymentRef}}</span>
                        <span v-else>-</span>
                      </p>
                      <p
                        class="float-right text-underline pointer"
                        @click="$bvModal.show('slipDetailsModal')"
                        v-if="slip.orderId > 0"
                      >Slip Preview</p>
                    </b-col>

                    <b-col sm="4" class="font-weight-bold">Pay via :</b-col>
                    <b-col sm="8">
                      <p class="float-left">{{transaction.order.paymentChanelName}}</p>
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
                        v-if="transaction.order.orderStatusId == 4 || transaction.order.orderStatusId == 1"
                        @click="downloadShippingAddress"
                      />
                    </b-col>
                  </b-row>
                  <b-row class="address-box">
                    <b-col sm="4" class="font-weight-bold">Tracking No. :</b-col>
                    <b-col sm="8">
                      <p
                        class="float-left"
                        v-if="transaction.order.trackingNo != null"
                      >{{transaction.order.trackingNo}}</p>
                      <p class="float-left" v-else>-</p>
                      <p
                        class="float-right text-underline pointer"
                        @click="$bvModal.show('updateTrackNo')"
                        v-if="transaction.order.orderStatusId == 4 || transaction.order.orderStatusId == 1"
                      >Edit</p>
                    </b-col>

                    <b-col sm="4" class="font-weight-bold">Send via :</b-col>
                    <b-col sm="8">
                      <p class="float-left">{{transaction.order.shippingTypeName}}</p>
                    </b-col>
                  </b-row>
                </div>
              </b-col>
            </b-row>

            <div class="my-4">
              <h4 class="font-weight-bold">Order Details</h4>
            </div>

            <!-- <div v-for="(item, index) in transaction.orderItemList" v-bind:key="index">
              <b-row>
                <b-col cols="3">
                  <img :src="item.productImageUrl" alt="sample-product" class="w-100" />
                </b-col>
                <b-col cols="9">
                  <b-row>
                    <b-col md="7">
                      <p class="mb-0 font-weight-bold f-17">{{item.productName}}</p>
                      <p class="order-desc">{{item.productShortDescription}}</p>
                    </b-col>
                    <b-col md="5" class="text-md-right">
                      <div>
                        <div>
                          <span class="text-secondary mr-sm-5">{{item.productSize}}</span>
                          <b-form-input
                            class="input-disabled d-inline-block"
                            :value="item.orderItemQuantity"
                            disabled
                          ></b-form-input>
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col md="9" offset-md="3">
                  <b-row class="pab-0">
                    <b-col cols="6">
                      <div>
                        <p
                          class="m-0 order-discount"
                          v-if="item.discount != 0"
                        >Discount : {{item.discount}} Baht</p>
                        <p
                          class="font-weight-bold m-0 f-17"
                        >{{item.subtotal | numeral('0,0.00')}} Baht</p>
                      </div>
                    </b-col>
                    <b-col cols="6" class="text-right">
                      <p
                        class="font-weight-bold m-0 f-17 right-0 pab"
                      >{{item.grandTotal | numeral('0,0.00')}} Baht</p>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <hr />
            </div>-->

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
                    v-bind:style="{ 'background-image': 'url(' + data.item.productImageUrl + ')' }"
                  ></div>
                </template>
                <template v-slot:cell(productName)="data">
                  <p class="m-0 font-weight-bold nobreak">{{data.item.productName}}</p>
                  <!-- <p class="m-0 nobreak">{{data.item.productShortDescription}}</p> -->
                  <p class="m-0 nobreak">
                    <span class="font-weight-bold" v-if="data.item.promocodeName != null">
                      Promotion :
                      {{data.item.promocodeName}}
                    </span>
                    <span class="font-weight-bold" v-else>Promotion : -</span>
                  </p>
                </template>
                <template v-slot:cell(subtotal)="data">
                  <p class="m-0">{{data.item.subtotal | numeral('0,0.00')}}</p>
                </template>
                <template v-slot:cell(discount)="data">
                  <p class="m-0">{{data.item.discount | numeral('0,0.00')}}</p>
                </template>
                <template v-slot:cell(grandTotal)="data">
                  <p class="m-0">{{data.item.grandTotal | numeral('0,0.00')}}</p>
                </template>
              </b-table>
            </div>

            <b-row>
              <b-col sm="6" offset-md="6">
                <div class="border-gray p-3">
                  <b-row class="pb-2">
                    <b-col cols="7">Product Quantity</b-col>
                    <b-col
                      cols="5"
                      class="font-weight-bold text-right"
                    >{{transaction.order.productQuantity}} pcs</b-col>
                  </b-row>
                  <b-row class="pb-2">
                    <b-col cols="7">Total</b-col>
                    <b-col
                      cols="5"
                      class="font-weight-bold text-right"
                    >{{transaction.order.subtotal | numeral('0,0.00')}} Baht</b-col>
                  </b-row>
                  <b-row class="pb-2 sub-color" v-if="transaction.order.discount != 0">
                    <b-col cols="7">Discount</b-col>
                    <b-col
                      cols="5"
                      class="font-weight-bold text-right"
                    >{{transaction.order.discount | numeral('0,0.00')}} Baht</b-col>
                  </b-row>
                  <b-row class="pb-2">
                    <b-col cols="7">Shipping fee</b-col>
                    <b-col
                      cols="5"
                      class="font-weight-bold text-right"
                      v-if="transaction.order.shippingCost != 0"
                    >{{transaction.order.shippingCost | numeral('0,0.00')}} Baht</b-col>
                    <b-col cols="5" class="font-weight-bold text-right" v-else>Free</b-col>
                  </b-row>
                  <b-row class="pb-2" v-if="transaction.order.shippingDiscount != 0">
                    <b-col cols="7">Shipping discount promo (abc123)</b-col>
                    <b-col
                      cols="5"
                      class="font-weight-bold text-right"
                    >{{transaction.order.shippingDiscount | numeral('0,0.00')}} Baht</b-col>
                  </b-row>
                  <b-row class="pb-2">
                    <b-col cols="7">Grand total</b-col>
                    <b-col
                      cols="5"
                      class="font-weight-bold text-right"
                    >{{transaction.order.grandTotal | numeral('0,0.00')}} Baht</b-col>
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
                  <span>{{ new Date(data.item.createdTime) | moment("DD MMM YYYY (HH:mm)") }}</span>
                </template>
              </b-table>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </form>
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
      <div class="text-center mt-5" v-if="transaction.order.orderStatusId == 3">
        <b-button
          class="btn btn-main float-right"
          @click="sendApproveRejectRequest(4)"
          :disabled="isApprove"
        >Approve</b-button>
        <b-button class="btn btn-sub float-left" @click="showRejectModal">Reject</b-button>
      </div>
    </b-modal>

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
                v-model="transaction.order.trackingNo"
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
        <b-button class="btn btn-sub float-left" @click="closeUpdateTrackModal">Close</b-button>
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

    <ModalSuccess
      v-if="modalAlertShow"
      :msg="msgModal"
      :text="textModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
    />

    <b-modal
      id="changeAddressModal"
      ref="changeAddressModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <HeaderLine text="Address Book" class="w-100" />
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('changeAddressModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col md="6">
              <InputText
                textFloat="Name"
                placeholder="Name"
                type="text"
                name="name"
                v-model="addressDetail.firstname"
                v-bind:isValidate="$v.addressDetail.firstname.$error"
                :v="$v.addressDetail.firstname"
                isRequired
              />
            </b-col>
            <b-col md="6">
              <InputText
                textFloat="Lastname"
                placeholder="Lastname"
                type="text"
                name="lastname"
                v-model="addressDetail.lastname"
                v-bind:isValidate="$v.addressDetail.lastname.$error"
                :v="$v.addressDetail.lastname"
                isRequired
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col>
              <InputTextArea
                textFloat="Address"
                placeholder="Address"
                type="text"
                name="addressdetail"
                isRequired
                v-model="addressDetail.address"
                v-bind:isValidate="$v.addressDetail.address.$error"
                :v="$v.addressDetail.address"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <InputSelect
                class="mb-4"
                title="Province"
                name="province"
                v-bind:options="list.provinces"
                v-on:onDataChange="handleChangeProvince"
                v-model="addressDetail.provinceId"
                isRequired
                v-bind:isValidate="$v.addressDetail.provinceId.$error"
                :v="$v.addressDetail.provinceId"
              />
            </b-col>
            <b-col md="6">
              <InputSelect
                title="District"
                name="district"
                v-bind:options="list.districts"
                v-on:onDataChange="handleChangeDistrict"
                v-model="addressDetail.districtId"
                isRequired
                v-bind:isValidate="$v.addressDetail.districtId.$error"
                :v="$v.addressDetail.districtId"
              />
            </b-col>
          </b-row>

          <b-row>
            <b-col md="6">
              <InputSelect
                class="mb-4"
                title="Subdistrict"
                name="subdistrict"
                v-bind:options="list.subDistricts"
                v-on:onDataChange="handleChangeSubDistrict"
                v-model="addressDetail.subdistrictId"
                isRequired
                v-bind:isValidate="$v.addressDetail.subdistrictId.$error"
                :v="$v.addressDetail.subdistrictId"
              />
            </b-col>
            <b-col md="6">
              <InputText
                textFloat="Zip Code"
                placeholder="Zip Code"
                type="text"
                name="zipcode"
                isRequired
                v-model="addressDetail.code"
                :disabled="true"
                v-bind:isValidate="$v.addressDetail.zipCodeId.$error"
                :v="$v.addressDetail.zipCodeId"
              />
            </b-col>
          </b-row>

          <b-row v-if="addressDetail.addressTypeId == 2">
            <b-col>
              <InputText
                textFloat="Tax ID"
                placeholder="Tax ID"
                type="text"
                name="tax"
                v-model="addressDetail.tax"
              />
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-3">
        <b-button class="btn btn-main" @click="saveAddress">Save</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";
import HeaderLine from "@/components/HeaderLine";
import axios from "axios";
import * as moment from "moment/moment";
import { required, numeric, minValue } from "vuelidate/lib/validators";
import UploadFile from "@/components/inputs/UploadFile";
import InputSelect from "@/components/inputs/InputSelect";
import ModalSuccess from "@/components/ModalSuccess";

export default {
  name: "BannerDetails",
  components: {
    InputText,
    InputTextArea,
    HeaderLine,
    UploadFile,
    InputSelect,
    ModalSuccess
  },
  data() {
    return {
      imageUrl: "",
      items: [],
      itemsOrder: [],
      slip: [],
      bank: [],
      selected: [],
      statusList: [],
      trackNo: {},
      requests: {},
      isDisable: true,
      isDisables: true,
      isLoadingData: false,
      isApprove: false,
      isUpload: false,
      modalAlertShow: false,
      hasImage: false,
      msgModal: null,
      textModal: null,
      oldTrackNo: "",
      errortxt: "",
      note: "",
      statusColor: "",
      id: this.$route.params.id,
      fields: [
        {
          key: "createdTime",
          label: "Date/Time",
          class: "w-100px"
        },
        {
          key: "orderSatusName",
          label: "Status/Note",
          class: "w-100px"
        },
        {
          key: "updatedByName",
          label: "Updated By",
          class: "w-100px"
        },
        {
          key: "note",
          label: "Note",
          class: "w-100px"
        }
      ],
      fieldsOrder: [
        {
          key: "productImageUrl",
          label: "",
          class: "w-200"
        },
        {
          key: "productName",
          label: "Product Name",
          tdClass: "text-left w-200",
          thclass: "w-200"
        },
        {
          key: "subtotal",
          label: "Unit Price",
          class: "w-100px"
        },
        {
          key: "orderItemQuantity",
          label: "Qty."
        },
        {
          key: "discount",
          label: "Discount",
          class: "w-100px"
        },
        {
          key: "grandTotal",
          label: "Net",
          class: "w-100px"
        }
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
            tax: null
          },
          billingAddress: {
            addressTypeName: "",
            orderId: 0,
            addressTypeId: 2,
            firstname: "",
            lastname: null,
            address: "",
            zipCodeId: 0,
            tax: ""
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
          paymentTime: null
        },
        orderItemList: [],
        orderStatusLogList: []
      },
      upload: {
        transferSlip: "",
        uploadDate: "",
        transferAmount: 0,
        bankTransfer: 0
      },
      addressDetail: {
        provinceId: 0,
        districtId: 0,
        subdistrictId: 0,
        zipCodeId: 0,
        id: 0,
        code: null,
        name: null,
        userGUID: null,
        defaultBilling: false,
        defaultShipping: false,
        firstname: null,
        lastname: null,
        address: null,
        tax: null
      },
      list: {
        provinces: [],
        districts: [{ value: 0, text: this.$t("Please select District") }],
        subDistricts: [
          { value: 0, text: this.$t("Please select Sub-District") }
        ]
      }
    };
  },
  validations: {
    upload: {
      transferSlip: { required },
      uploadDate: { required },
      transferAmount: { required },
      bankTransfer: { required }
    },
    addressDetail: {
      districtId: {
        required,
        numeric,
        minValue: minValue(1)
      },
      subdistrictId: {
        required,
        numeric,
        minValue: minValue(1)
      },
      provinceId: {
        required,
        numeric,
        minValue: minValue(1)
      },
      zipCodeId: {
        required,
        numeric,
        minValue: minValue(1)
      },
      address: { required },
      firstname: { required },
      lastname: { required }
    }
  },
  computed: {
    colorSelect: function() {
      if (this.selected == 1) {
        return "text-success";
      } else if (this.selected >= 5) {
        return "text-danger";
      } else {
        return "text-warning";
      }
    }
  },
  created: async function() {
    await this.getData();
    await this.loadDataProvinces();
  },
  methods: {
    moment: function() {
      return moment();
    },
    handleChangeSourceBank: async function(value) {
      this.upload.bankTransfer = value;
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
    setStatusColor: function() {
      if (this.transaction.order.orderStatusId == 1) {
        this.statusColor = "text-success";
      } else if (this.transaction.order.orderStatusId > 5) {
        this.statusColor = "text-danger";
      } else {
        this.statusColor = "text-warning";
      }
    },
    getData: async function() {
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
        //this.setStatusColor();
        this.handleChangeBtn();

        this.isLoadingData = false;

        if (this.transaction.order.id > 0) {
          this.oldTrackNo = this.transaction.order.trackingNo;
        }
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
        if (this.slip.orderId > 0) {
          this.upload.transferAmount = this.slip.amountTransfer;
          this.upload.uploadDate = this.slip.paymentTime;
          this.upload.bankTransfer = this.slip.bankId;
          this.imageUrl = this.slip.imageUrl;
          this.setImageBase64(this.slip.imageUrl);
        }
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
    updateTrackingNo: async function() {
      this.$refs["updateTrackNo"].hide();
      this.isDisable = true;

      this.trackNo = {
        OrderId: this.transaction.order.id,
        TrackingNo: this.transaction.order.trackingNo
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/UpdateTrackingNo`,
        null,
        this.$headers,
        this.trackNo
      );

      if (data.result == 1) {
        this.getData();
      }

      this.isDisable = false;
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
    onImageChange: async function(img) {
      this.imageUrl = img.name;
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => {
        this.upload.transferSlip = reader.result;
      };
      this.hasImage = true;
    },
    checkModal: async function() {
      this.$v.upload.$touch();
      if (this.$v.upload.$error) {
        return;
      }

      this.$v.upload.$reset();
      this.isUpload = true;

      let uploadData = {
        OrderId: this.transaction.order.id,
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
        this.modalAlertShow = true;
        this.msgModal = "Success!";
        this.textModal = "Status updated";
        this.getData();
      } else {
        this.isUpload = false;
        this.errortxt = data.message;
      }
    },
    deleteImage(value) {
      this.upload.transferSlip = "";
      this.imageUrl = "";
      this.hasImage = false;
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
        OrderId: this.transaction.order.id,
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
        this.modalAlertShow = true;
        this.msgModal = "Success!";
        this.textModal = "Status updated";
        this.getData();
      }
    },
    downloadShippingAddress: async function() {
      axios({
        url: `${this.$baseUrl}/api/transaction/ShippingAddress/${this.id}`,
        method: "GET",
        headers: this.$headers,
        responseType: "blob"
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var dateExcel = moment().format("DDMMYYYYhhmmss");

        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          `Shipping-Address-Label-${this.id}-` +
            dateExcel +
            `.${response.data.type.split("/").pop(-1)}`
        );
        document.body.appendChild(fileLink);
        fileLink.click();
      });
    },
    handleChangeBtn: function() {
      if (
        this.transaction.order.trackingNo == null ||
        this.transaction.order.trackingNo == ""
      ) {
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
    closeUpdateTrackModal: function() {
      this.$refs["updateTrackNo"].hide();
      if (this.oldTrackNo != "") {
        this.transaction.order.trackingNo = this.oldTrackNo;
      }
    },
    showPreview(e) {
      if (this.upload.transferSlip != "") {
        this.$refs["showSlipImgModal"].show();
      } else {
        e.preventDefault();
      }
    },
    changeStatus: async function() {
      this.requestData = {
        OrderId: this.transaction.order.id,
        OrderStatusId: this.selected,
        Note: ""
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/SaveOrderStatusLog`,
        null,
        this.$headers,
        this.requestData
      );

      if (data.result == 1) {
        location.reload();
      }
    },
    editAddress: async function(orderid, id) {
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

      await this.handleChangeProvince(
        this.addressDetail.provinceId,
        this.addressDetail.districtId,
        this.addressDetail.subdistrictId
      );
      await this.handleChangeDistrict(
        this.addressDetail.districtId,
        this.addressDetail.subdistrictId
      );

      await this.handleChangeSubDistrict(this.addressDetail.subdistrictId);
      await this.setZipCode(this.addressDetail.subdistrictId);

      this.$refs["changeAddressModal"].show();
    },
    loadDataProvinces: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/address/province`,
        null,
        this.$headers,
        null
      );
      let list = [{ value: 0, text: "Please select Province" }];
      let provinces = data.detail;
      provinces = provinces.map(obj => {
        return {
          value: obj.id,
          text: obj.name
        };
      });
      this.list.provinces = list.concat(provinces);
    },
    setZipCode: async function(subdistrictId = 0) {
      if (subdistrictId) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/zipcode/${subdistrictId}`,
          null,
          this.$headers,
          null
        );

        this.addressDetail.code = data.detail.name;
        this.addressDetail.zipCodeId = data.detail.id;
      } else {
        this.addressDetail.code = "";
        this.addressDetail.zipCodeId = 0;
      }
    },
    handleChangeSubDistrict: async function(value, zipCodeId = "") {
      this.addressDetail.subdistrictId = value;
      await this.setZipCode(this.addressDetail.subdistrictId);
    },
    handleChangeDistrict: async function(value, subdistrictId = 0) {
      this.addressDetail.districtId = value;
      this.addressDetail.subdistrictName = "";

      let list = [{ value: 0, text: "Please select District" }];
      let subDistricts = [];
      if (value) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/subdistrict/${this.addressDetail.districtId}`,
          null,
          this.$headers,
          null
        );
        subDistricts = data.detail;
        subDistricts = subDistricts.map(obj => {
          return {
            value: obj.id,
            text: obj.name
          };
        });
      }
      this.list.subDistricts = await list.concat(subDistricts);
      this.addressDetail.subdistrictId = subdistrictId;
      await this.setZipCode(this.addressDetail.subdistrictId);
    },
    handleChangeProvince: async function(
      value,
      districtId = 0,
      subdistrictId = 0
    ) {
      this.addressDetail.provinceId = value;
      // this.addressDetail.districtId = "";
      // this.addressDetail.subdistrictId = "";

      let list = [{ value: 0, text: "Please select District" }];
      let districts = [];
      if (value) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/district/${this.addressDetail.provinceId}`,
          null,
          this.$headers,
          null
        );
        districts = data.detail;
        districts = districts.map(obj => {
          return {
            value: obj.id,
            text: obj.name
          };
        });
      }
      this.list.districts = await list.concat(districts);
      this.addressDetail.districtId = districtId;
      this.addressDetail.subdistrictId = subdistrictId;
      await this.setZipCode(this.addressDetail.subdistrictId);
    },
    saveAddress: async function() {
      this.$v.addressDetail.$touch();
      if (this.$v.addressDetail.$error) {
        return;
      }

      let addressData = {
        orderId: this.addressDetail.orderId,
        addressTypeId: this.addressDetail.addressTypeId,
        name: this.addressDetail.name,
        firstname: this.addressDetail.firstname,
        lastname: this.addressDetail.lastname,
        address: this.addressDetail.address,
        zipCodeId: this.addressDetail.zipCodeId,
        tax: this.addressDetail.tax
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/transaction/UpdateOrderAddress`,
        null,
        this.$headers,
        addressData
      );

      if (data.result == 1) {
        this.$refs["changeAddressModal"].hide();
        this.modalAlertShow = true;
        this.msgModal = "Success!";
        this.getData();
      }
    }
  }
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
  padding-top: 75%;
  max-width: 200px;
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