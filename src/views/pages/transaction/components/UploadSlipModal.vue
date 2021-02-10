<template>
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
              v-bind:style="{ 'background-image': 'url(' + imageUrl + ')' }"
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
</template>

<script>
import InputSelect from "@/components/inputs/InputSelect";
import UploadFile from "@/components/inputs/UploadFile";
import InputText from "@/components/inputs/InputText";
import * as moment from "moment/moment";
import { required } from "vuelidate/lib/validators";

export default {
  components: {
    InputSelect,
    UploadFile,
    InputText
  },
  props: {
    isValidate: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      id: 0,
      isDisables: true,
      note: "",
      isUpload: false,
      hasImage: false,
      upload: {
        transferSlip: "",
        uploadDate: "",
        transferAmount: 0,
        bankTransfer: 0
      },
      imageUrl: "",
      bank: [],
      errortxt: "",
      images: ""
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
  methods: {
    show(id, data, bank) {
      this.id = id;
      this.upload = data;
      this.bank = bank;

      if (data.orderId > 0) {
        this.upload.transferAmount = data.amountTransfer;
        this.upload.uploadDate = data.paymentTime;
        this.upload.bankTransfer = data.bankId;
        this.imageUrl = data.imageUrl;
        this.setImageBase64(data.imageUrl);
        this.hasImage = true;
        if (data.bankId == 0) this.upload.bankTransfer = bank[0].value;
        else this.upload.bankTransfer = data.bankId;
      } else {
        this.upload.transferAmount = 0;
        this.upload.uploadDate = moment().format();
        this.upload.transferSlip = "";
        this.upload.bankTransfer = 1;
        this.imageUrl = "";
        this.upload.bankTransfer = bank[0].value;
      }

      this.$v.upload.$reset();
      this.$refs["uploadSlipModal"].show();
    },
    setImageBase64: async function(img) {
      let result = await this.getBase64Image(img);
      this.upload.transferSlip = result;
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
    hide() {
      this.$refs["uploadSlipModal"].hide();
    },
    showPreview(e) {
      if (this.upload.transferSlip != "") {
        this.$emit("showPreview", this.imageUrl);
      } else {
        e.preventDefault();
      }
    },
    saveImagetoDb: async function(img) {
      var imgData = {
        base64: img
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/image/save`,
        null,
        this.$headers,
        imgData
      );

      if (data.result == 1) {
        return data.detail.url;
      }
    },
    onImageChange(img) {
      var reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = async () => {
        this.images = await this.saveImagetoDb(reader.result);
        this.imageUrl = this.images;
        this.upload.transferSlip = reader.result;
      };
      this.hasImage = true;
    },
    deleteImage(value) {
      this.upload.transferSlip = "";
      this.imageUrl = "";
      this.hasImage = false;
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
        this.isUpload = false;
        this.errortxt = "";
        this.$emit("getList");
      } else {
        this.isUpload = false;
        this.errortxt = data.message;
      }
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