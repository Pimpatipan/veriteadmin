<template>
  <div class="d-none">
    <b-modal
      v-model="modalShow"
      ref="alertModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header">
        <!-- <button type="button" aria-label="Close" class="close" @click="hideModal">×</button> -->
      </div>
      <div class="text-center">
        <img :src="img" alt="success" class="mb-3" />
        <p class="text-msg" v-if="msg">{{ msg }}</p>
        <p class="text-text" v-if="text">{{ text }}</p>
        <p class="text-sub" v-if="subText">{{ subText }}</p>
      </div>
      <div class="text-center">
        <b-button class="btn btn-danger" @click="handleCloseModal">Close</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      required: false,
      type: String
    },
    text: {
      required: false,
      type: String
    },
    subText: {
      required: false,
      type: String
    },
    isOpen: {
      required: false,
      type: Boolean
    },
    isSuccess: {
      required: false,
      type: Boolean
    },
    img: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      modalShow: this.isOpen
    };
  },
  methods: {
    hideModal() {
      this.$emit("close");
      this.$refs["alertModal"].hide();
    },
    handleCloseModal() {
      this.$refs["alertModal"].hide();
      if (!this.isSuccess) {
      } else {
        this.$emit("closeModal", this.isSuccess );
      }
    }
  }
};
</script>

<style scoped>
.modal-header {
  border: 0 !important;
  padding: 0;
}
.text-msg {
  font-family: "Kanit-SemiBold";
  font-size: 2rem;
  color: #4a4a4a;
}
.text-text {
  color: #4a4a4a;
  margin-bottom: 0;
  font-size: 1.25rem;
}
.text-sub {
  color: #afce38;
  font-size: 1.25rem;
}
.modal-body {
  margin: auto;
  text-align: center;
}
</style>