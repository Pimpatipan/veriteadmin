<template>
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
              v-bind:style="{ 'background-image': 'url(' + img + ')' }"
            ></div>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      img: ""
    };
  },
  methods: {
    show(img) {
      this.img = img;
      this.$refs["showSlipImgModal"].show();
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