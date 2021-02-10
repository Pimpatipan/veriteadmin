<template>
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
</template>

<script>
import InputText from "@/components/inputs/InputText";

export default {
  components: {
    InputText
  },
  data() {
    return {
      trackno: "",
      isDisable: true,
      id: 0
    };
  },
  methods: {
    show(id) {
      this.id = id;
      this.$refs["updateTrackNo"].show();
    },
    handleChangeBtn: function() {
      if (this.trackno == "") {
        this.isDisable = true;
      } else {
        this.isDisable = false;
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
        this.$emit("getList");
      }

      this.isDisable = false;
    }
  }
};
</script>