<template>
  <div>
    <div class="div-input">
      <div :class="['input-custom', { error: isValidate }]">
        <label>
          {{textFloat}}
          <span v-if="isRequired" class="text-danger">*</span>
        </label>
        <div class="d-flex justify-content-center align-items-center">
          <div class="w-100 display-only">
            <input
              :class="['custom-input']"
              :type="type"
              :placeholder="placeholder"
              :name="name"
              :required="required"
              :value="fileName"
              :size="size"
              disabled
            />
            <font-awesome-icon
              icon="times-circle"
              class="text-secondary delete-icon pointer"
              v-if="fileName"
              @click="deleteImage"
            />
          </div>
          <label class="mb-0 btn-main" :size="size">
            <input
              type="file"
              v-on:change="handleFileChange"
              :required="required"
              :name="name"
              ref="input"
            />
            <font-awesome-icon icon="file-upload" color="white" class="bg-icon mr-2" :size="size" />Choose file
          </label>
        </div>
      </div>
      <!-- <b-button
        type="button"
        class="btn-download-file"
        variant="link"
        @click.prevent="downloadItem(downloadPath)"
      >{{fileName}}</b-button>-->
      <p class="detail-format">{{text}}</p>
      <div v-if="v && v.$error">
        <span class="text-error" v-if="v.required == false">This field can’t be empty</span>
      </div>
    </div>
    <!-- <ModalAlert
      v-if="modalAlertShow"
      :msg="msgModal"
      :img="imgModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
      :isSuccess="isSuccess"
    />-->
  </div>
</template>

<script>
import axios from "axios";
import ModalAlert from "@/components/ModalAlert";

export default {
  components: {
    ModalAlert
  },
  props: {
    textFloat: {
      required: true,
      type: String
    },
    text: {
      required: true,
      type: String
    },
    format: {
      required: true,
      type: String
    },
    fileName: {
      required: false,
      type: String
    },
    required: {
      required: false,
      type: Boolean
    },
    name: {
      required: false,
      type: String
    },
    isRequired: {
      required: false,
      type: Boolean
    },
    isValidate: {
      required: false,
      type: Boolean
    },
    placeholder: {
      required: true,
      type: String
    },
    size: {
      required: false,
      type: String
    },
    downloadPath: {
      required: false,
      type: String
    },
    v: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      file: "",
      value: "",
      type: {
        all: ["image/jpeg", "image/png", "video/mp4"],
        file: ["image/jpeg", "image/png", "application/pdf"],
        pdf: ["application/pdf"],
        png: ["image/png"],
        image: ["image/jpeg", "image/png"],
        video: ["video/mp4"],
        excel: [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ]
      },
      error: "",
      hasError: false,
      hasImage: false,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      isSuccess: false
    };
  },
  methods: {
    handleFileChange(e) {
      this.hasError = false;
      this.error = "";
      var _validFileExtensions = this.type.file;
      if (this.format == "image") {
        _validFileExtensions = this.type.image;
      } else if (this.format == "video") {
        _validFileExtensions = this.type.video;
      } else if (this.format == "all") {
        _validFileExtensions = this.type.all;
      } else if (this.format == "pdf") {
        _validFileExtensions = this.type.pdf;
      } else if (this.format == "excel") {
        _validFileExtensions = this.type.excel;
      }
      this.value = e.target.files[0]; 
      if (e.target.files.length) {
        if (_validFileExtensions.indexOf(this.value.type) < 0) {
          // this.value = "";
          // this.$refs.input.value = "";
          // this.error = `*${this.$t("invalidFileType")}`;
          // this.hasError = true;
          // this.modalAlertShow = true;
          // this.msgModal = "This file type is not supported";
          // this.imgModal = "/img/icon-unsuccess.png";
          // this.isSuccess = false;
          alert("This file type is not supported");
          return;
        } else if (
          this.value.size > 10000000 &&
          (this.format == "image" || this.format == "pdf")
        ) {
          alert("This file size is too large");
          return;
        } else if (
          this.value.size > 50000000 &&
          (this.format == "video" || this.format == "all")
        ) {
          alert("This file size is too large");
          return;
        } else if (this.value.size > 10000000 && this.format == "excel") {
          alert("This file size is too large");
          return;
        }
      } else {
        this.value = "";
        this.$refs.input.value = "";
        this.hasError = true;
      }
      this.$emit("onFileChange", this.value);
      //this.hasImage = true;
    },
    downloadItem: async function(path) {
      let pathFile = path;
      axios({
        url: pathFile,
        method: "GET",
        headers: null,
        responseType: "blob"
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          `download.${response.data.type.split("/").pop(-1)}`
        );
        document.body.appendChild(fileLink);
        fileLink.click();
      });
    },
    deleteImage() {
      this.$emit("delete", true);
      this.hasImage = false;
    }
  }
};
</script>

<style scoped>
input[type="file"] {
  display: none;
}
.detail-format {
  color: #9b9b9b;
  font-size: 12px;
  font-family: "Kanit-Light";
  margin-top: 3px;
  margin-bottom: 0px;
  height: 35px;
}
/* .bg-icon {
  width: 25px;
  height: 25px;
  margin: 5px 0px;
} */
.bg-icon.fa-lg {
  margin: 8px 0px;
}
.div-input {
  margin-bottom: 15px;
  position: relative;
  white-space: nowrap;
}
.input-custom {
  padding: 0px;
}
.input-custom > label {
  color: #16274a;
  font-size: 16px;
  margin-bottom: 2px;
  font-weight: bold;
}
input.custom-input {
  color: #16274a;
  background-color: white;
  border: 1px solid #bcbcbc;
  border-radius: 0px;
  padding: 7px 10px;
}
label[size="lg"].btn-main,
input[size="lg"].custom-input {
  height: 45px;
}
.input-custom.error .custom-input {
  border-color: red !important;
}
::-webkit-input-placeholder {
  /* Edge */
  color: rgba(22, 39, 74, 0.4);
}
:-ms-input-placeholder {
  /* Internet Explorer */
  color: rgba(22, 39, 74, 0.4);
}
::placeholder {
  color: rgba(22, 39, 74, 0.4);
}
.custom-input {
  display: block;
  border: none;
  width: 100%;
}
.text-desc {
  color: #16274a;
  font-size: 15px;
  font-family: "Kanit-Light";
}
.display-only {
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.btn-main {
  width: 120px;
  text-align: center;
  height: 37px;
  vertical-align: middle;
  cursor: pointer;
  background: #16274a;
  color: white;
  padding: 7px 10px;
}
.btn-download-file {
  padding: 0;
  text-decoration: underline;
}
.delete-icon {
  position: absolute;
  right: 5%;
  top: 10px;
}
.text-error {
  color: red;
}
@media (max-width: 767.98px) {
  .input-custom > label {
    font-size: 15px;
  }
  .detail-format {
    font-size: 11px;
  }
}
</style>

