<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Import Product Data</h1>
          </b-col>
        </b-row>

        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4">
            <UploadFile
              textFloat="File"
              placeholder="Please choose file"
              format="excel"
              name="file"
              text="*Please upload only file .xlsx less than 10 MB"
              isRequired
              v-on:onFileChange="onFileChange"
              v-on:delete="deleteFile"
              :fileName="filename"
              v-model="form.file"
              :v="$v.form.file"
            />

            <b-row class="mt-5">
              <b-col md="6">
                <b-button href="/product" class="btn-details-set">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <b-button
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  :disabled="isDisable"
                  @click="importData"
                >Submit</b-button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </form>

    <b-modal
      id="AddEmailModal"
      ref="AddEmailModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Add Email</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('AddEmailModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <p>Please enter your email , We will send import result to your email</p>

              <InputText
                textFloat="Email"
                placeholder="Email"
                type="text"
                name="email"
                isRequired
                v-model="form.mail"
                @onKeyup="handleChangeEmail"
              />
            </b-col>
          </b-row>
          <div class="text-center mt-3">
            <b-button
              class="btn btn-main"
              :disabled="hasEmailorOnSubmit"
              @click="submit"
            >Submit</b-button>
          </div>
        </b-container>
      </div>
    </b-modal>
  </div>
</template>

<script>
import UploadFile from "@/components/inputs/UploadFile";
import InputText from "@/components/inputs/InputText";
import VueCookies from "vue-cookies";
import { required } from "vuelidate/lib/validators";

export default {
  name: "InventoryImportData",
  components: {
    UploadFile,
    InputText
  },
  data() {
    return {
      isDisable: true,
      hasEmailorOnSubmit: false,
      importerror: false,
      error: true,
      filename: "",
      form: {
        mail: "",
        file: ""
      }
    };
  },
  validations: {
    form: {
      file: { required }
    }
  },
  created: async function() {
    this.form.mail = VueCookies.get("username");
  },
  methods: {
    handleChangeEmail() {
      if (this.form.mail != "") {
        this.hasEmailorOnSubmit = false;
      } else {
        this.hasEmailorOnSubmit = true;
      }
    },
    onFileChange(file) {
      this.filename = file.name;
      this.isDisable = false;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.file = reader.result;
      };
    },
    deleteFile(value) {
      this.form.file = null;
      this.filename = null;
      this.isDisable = true;
    },
    importData: async function(id) {
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        return;
      }

      this.$refs["AddEmailModal"].show();
    },
    submit: async function(id) {
      this.hasEmailorOnSubmit = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/importProduct`,
        null,
        this.$headers,
        this.form
      );

      if (data.result == 1) {
        window.location.href = "/product";
      }
    }
  }
};
</script>