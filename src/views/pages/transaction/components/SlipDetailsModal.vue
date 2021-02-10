<template>
  <div>
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
        >
          ×
        </button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col cols="6" class="slip-details">
              <b-row>
                <b-col lg="6" class="font-weight-bold">Transfer to :</b-col>
                <b-col lg="6">{{ slip.transferTo }}</b-col>
              </b-row>

              <b-row>
                <b-col lg="6" class="font-weight-bold"
                  >Amount to be paid :</b-col
                >
                <b-col lg="6">{{
                  slip.amountToBePaid | numeral("0,0.00")
                }}</b-col>
              </b-row>
            </b-col>
            <b-col cols="6" class="slip-details">
              <b-row>
                <b-col lg="6" class="font-weight-bold">Date / time :</b-col>
                <b-col lg="6">{{
                  new Date(slip.paymentTime) | moment("DD/MM/YYYY HH:mm")
                }}</b-col>
              </b-row>
              <b-row>
                <b-col lg="6" class="font-weight-bold">Amount transfer :</b-col>
                <b-col lg="6">{{
                  slip.amountTransfer | numeral("0,0.00")
                }}</b-col>
              </b-row>
            </b-col>

            <b-col>
              <p class="font-weight-bold my-3 text-center">Slip Preview</p>
              <div
                class="preview-box preview-box-slip"
                :class="[{ pointer: slip.imageUrl }]"
                v-bind:style="{
                  'background-image': 'url(' + slip.imageUrl + ')',
                }"
                @click="showPreview"
              ></div>
              <div class="text-center" v-if="slip.imageUrl != null">
                <span
                  @click="downloadItem(slip.imageUrl)"
                  class="text-primary text-underline pointer"
                  >Download</span
                >
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-5" v-if="status == 3">
        <b-button
          class="btn btn-main float-right"
          @click="sendApproveRejectRequest(4)"
          :disabled="isApprove"
          >Approve</b-button
        >
        <b-button class="btn btn-sub float-left" @click="showRejectModal"
          >Reject</b-button
        >
      </div>
    </b-modal>

    <ModalAlert
      v-if="modalAlertShow"
      :msg="msgModal"
      :img="imgModal"
      :isOpen="modalAlertShow"
      :isSuccess="true"
      :hideClose="true"
    />
  </div>
</template>

<script>
import axios from "axios";
import ModalAlert from "@/components/ModalAlert";

export default {
  props: {
    slip: {
      required: false,
      type: Array | Object,
    },
  },
  components: {
    ModalAlert,
  },
  data() {
    return {
      id: 0,
      status: 0,
      isDisables: true,
      isApprove: false,
      note: "",
      modalAlertShow: false,
      imgModal: "/img/loading.svg",
      msgModal: "Please wait...",
    };
  },
  methods: {
    show(id, status) {
      this.id = id;
      this.status = status;
      this.isApprove = false;
      this.$refs["slipDetailsModal"].show();
    },
    hide() {
      this.$refs["slipDetailsModal"].hide();
    },
    showRejectModal() {
      this.$refs["slipDetailsModal"].hide();
      this.$emit("showRejectModal");
    },
    sendApproveRejectRequest(statusId) {
      this.isApprove = true;

      var data = {
        OrderId: this.id,
        OrderStatusId: statusId,
        Note: this.note,
      };

      this.$emit("sendApproveRejectRequest", data);
    },
    showPreview(e) {
      if (this.slip.imageUrl != "") {
        this.$emit("showPreview", this.slip.imageUrl);
      } else {
        e.preventDefault();
      }
    },
    downloadItem: async function (path) {
      let pathFile = path;

      this.modalAlertShow = true;

      var name_without_ext = path
        .split("\\")
        .pop()
        .split("/")
        .pop()
        .split(".")[0];

      var data = {
        url: path,
      };

      axios({
        url: `${this.$baseUrl}/api/image/download`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: data,
      }).then((response) => {
        this.modalAlertShow = false;
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          `${name_without_ext}.${response.data.type.split("/").pop(-1)}`
        );
        document.body.appendChild(fileLink);
        fileLink.click();
      });
    },
  },
};
</script>