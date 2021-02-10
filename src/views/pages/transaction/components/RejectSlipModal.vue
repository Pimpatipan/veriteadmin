<template>
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
      <b-button class="btn btn-sub float-left" @click="showSlipModal">Back</b-button>
    </div>
  </b-modal>
</template>

<script>
import InputTextArea from "@/components/inputs/InputTextArea";

export default {
  components: {
    InputTextArea
  },
  data() {
    return {
      id: 0,
      isDisables: true,
      note: ""
    };
  },
  methods: {
    show(id) {
      this.id = id;
      this.$refs["rejectSlipModal"].show();
    },
    hide(id) {
      this.$refs["rejectSlipModal"].hide();
    },
    handleChangeBtns: function() {
      if (this.note != null) {
        this.isDisables = false;
      } else {
        this.isDisables = true;
      }
    },
    showSlipModal() {
      this.$refs["rejectSlipModal"].hide();
      this.$emit("showSlipModal");
    },
    sendApproveRejectRequest(statusId) {
      var data = {
        OrderId: this.id,
        OrderStatusId: statusId,
        Note: this.note
      };

      this.$emit("sendApproveRejectRequest", data);
    }
  }
};
</script>

<style scoped>
.b-contain {
  background-size: contain;
  padding-bottom: 50%;
}
</style>