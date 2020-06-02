<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Admin Details</h1>
          </b-col>
        </b-row>
        <b-row class="no-gutters bg-white-border mt-4 position-relative">
          <b-col class="px-4 px-sm-5 py-4" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>
          <b-col class="px-4 px-sm-5 py-4" v-else>
            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Name"
                  placeholder="Name"
                  type="text"
                  name="name"
                  isRequired
                  v-model="admin.userProfile.firstname"
                  :v="$v.admin.userProfile.firstname"
                  :isValidate="$v.admin.userProfile.firstname.$error"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Lastname"
                  placeholder="Lastname"
                  type="text"
                  name="lastname"
                  isRequired
                  v-model="admin.userProfile.lastname"
                  :v="$v.admin.userProfile.lastname"
                  :isValidate="$v.admin.userProfile.lastname.$error"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <span :class="[ 'verified-txt', verifiedColor ]">{{verifiedTxt}}</span>
                <InputText
                  textFloat="Email"
                  placeholder="Name"
                  type="text"
                  name="email"
                  isRequired
                  v-model="admin.userProfile.email"
                  :v="$v.admin.userProfile.email"
                  :isValidate="$v.admin.userProfile.email.$error"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Telephone No."
                  placeholder="Telephone No."
                  type="text"
                  name="telno"
                  v-model="admin.userProfile.telephone"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Password"
                  placeholder="Password"
                  type="password"
                  name="name"
                  isRequired
                  v-model="admin.userProfile.password"
                  :isValidate="$v.admin.userProfile.password.$error"
                  :v="$v.admin.userProfile.password"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Confirm Password"
                  placeholder="Confirm Password"
                  type="password"
                  name="lastname"
                  isRequired
                  v-model="admin.userProfile.confirmPassword"
                  :isValidate="$v.admin.userProfile.confirmPassword.$error"
                  :v="$v.admin.userProfile.confirmPassword"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="admin.userProfile.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span
                      class="ml-2 main-label"
                    >{{admin.userProfile.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button href="/admin" class="btn-details-set" :disabled="isDisable">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="checkForm(0)"
                  v-if="id != 0"
                  :disabled="isDisable"
                >Save</button>
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="checkForm(1)"
                  :disabled="isDisable"
                >Save & Exit</button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </form>
    <ModalAlert
      v-if="modalAlertShows"
      :msg="msgModals"
      :img="imgModals"
      :isOpen="modalAlertShows"
      @close="modalAlertShows = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
    />
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import {
  required,
  numeric,
  minValue,
  requiredIf,
  minLength,
  sameAs
} from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";

export default {
  name: "AdminDetails",
  components: {
    InputText,
    ModalAlert
  },
  data() {
    return {
      id: this.$route.params.id,
      items: [],
      msgModals: null,
      imgModals: null,
      modalAlertShows: false,
      isLoadingData: false,
      isSuccess: false,
      isError: false,
      isReset: false,
      isEdit: false,
      verifiedColor: "",
      verifiedTxt: "",
      rows: 0,
      flag: 0,
      admin: {
        userProfile: {
          userGUID: null,
          firstname: null,
          lastname: null,
          email: null,
          telephone: null,
          isVerified: false,
          password: null,
          confirmPassword: null,
          enabled: false
        }
      },
      isDisable: false,
      isBusy: false,
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ]
    };
  },
  validations: {
    admin: {
      userProfile: {
        firstname: { required },
        lastname: { required },
        email: { required },
        password: {
          required: requiredIf(function() {
            return this.id == 0;
          }),
          minLength: minLength(6)
        },
        confirmPassword: {
          required: requiredIf(function() {
            console.log(this.id)
            return this.id == 0;
          }),
          minLength: minLength(6),
          sameAsPassword: sameAs("password")
        }
      }
    }
  },
  mounted: async function() {
    await this.getData();
  },
  methods: {
    getData: async function() {
      if (this.id != 0) {
        this.isLoadingData = true;
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/admin/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          this.admin = data.detail;
          this.isLoadingData = false;
          this.$v.admin.userProfile.$reset();

          if (this.admin.userProfile.isVerified == true) {
            this.verifiedColor = "text-success";
            this.verifiedTxt = "Verified";
          } else {
            this.verifiedColor = "text-danger";
            this.verifiedTxt = "Not Verified";
          }
        }
      }
    },
    checkForm: async function(flag) {
      this.$v.admin.userProfile.$touch();

      if (this.$v.admin.userProfile.$error) {
        return;
      }

      this.modalAlertShows = false;
      this.flag = flag;

      this.submit();
    },
    submit: async function() {
      this.isDisable = true;

      if (this.id == 0) {
        this.admin.userProfile.userGUID == null;
      }

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/admin/save`,
        null,
        this.$headers,
        this.admin
      );

      this.modalAlertShows = true;
      if (data.result == 1) {
        this.imgModals = "/img/icon-check-green.png";
        this.msgModals = data.message;
        this.isSuccess = true;
      } else {
        this.imgModals = "/img/icon-unsuccess.png";
        this.msgModals = data.detail[0];
        this.isSuccess = false;
      }

      this.isDisable = false;
    },
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/admin";
      } else {
        if (this.id != 0) {
          this.getData();
        } else {
          window.location.href = "/admin";
        }
      }
    }
  }
};
</script>

<style scoped>
.verified-txt {
  position: absolute;
  right: 15px;
  top: 3px;
}
</style>