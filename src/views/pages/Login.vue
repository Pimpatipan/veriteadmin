<template>
  <div class="d-flex align-items-center min-vh-100 login-box">
    <b-container>
      <b-row class="justify-content-center">
        <c-col md="9" lg="6" class="login">
          <b-card-group>
            <b-card class="p-4">
              <b-card-body>
                <b-form v-on:submit.prevent="checkForm">
                  <div class="text-center">
                    <img src="img/logo.png" alt />
                    <hr class="my-4" />
                  </div>
                  <InputText
                    class="my-4 login-input"
                    v-model="form.email"
                    textFloat="Email"
                    placeholder="Email"
                    type="email"
                    name="email"
                    isRequired
                    :isValidate="$v.form.email.$error"
                    :v="$v.form.email"
                    @onKeyup="submitFormOnInput"
                  />
                  <InputText
                    class="my-4 login-input"
                    v-model="form.password"
                    textFloat="Password"
                    placeholder="Password"
                    type="password"
                    name="password"
                    isRequired
                    :isValidate="$v.form.password.$error"
                    :v="$v.form.password"
                    @onKeyup="submitFormOnInput"
                  />
                  <div class="text-center">
                    <p class="text-danger">{{error}}</p>
                  </div>
                  <b-row>
                    <c-col class="text-center">
                      <b-button
                        variant="primary"
                        type="button"
                        class="px-4 login-btn"
                        @click="checkForm"
                        :disabled="isDisable"
                      >Login</b-button>
                    </c-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </c-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { required, email, minLength } from "vuelidate/lib/validators";
import InputText from "@/components/inputs/InputText";

export default {
  name: "Login",
  components: {
    InputText
  },
  data() {
    return {
      error: "",
      form: {
        email: "",
        password: ""
      },
      isLoading: false,
      isDisable: false
    };
  },
  validations() {
    return {
      form: {
        email: { required, email },
        password: { required, minLength: minLength(6) }
      }
    };
  },
  methods: {
    checkForm: async function() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return;

      //-mock
      // await this.$cookies.set("back_office_token", "1234", 60 * 60 * 24 * 30);
      // window.location.href = "/banner";
      //-mock

      this.isDisable = true;
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/login`,
        null,
        null,
        this.form
      );
      this.isDisable = false;

      if (data.result == 1) {
        this.error = "";
        await this.$cookies.set(
          "back_office_token",
          data.detail,
          60 * 60 * 24 * 30
        );
        await this.$cookies.set(
          "username",
          this.form.email,
          60 * 60 * 24 * 30
        );
        window.location.href = "/dashboard";
      } else {
        this.error = data.message;
      }
    },
    submitFormOnInput: function(e) {
      if (e.keyCode === 13) {
        this.checkForm();
      }
    }
  }
};
</script>

<style scoped>
.login-box {
  background-color: #16274a;
}

.card {
  border-radius: 0;
}

.login-btn {
  padding: 15px !important;
  font-size: 16px;
  border-radius: 20px !important;
  background: #16274a;
  border: #16274a solid 1px;
  color: #ffffff;
  text-align: center;
  width: 100%;
  margin: auto;
  transition: 0.3s;
}

.login-btn:hover {
  background: #2c4b8a;
  color: #ffffff;
}

.login {
  max-width: 500px;
}

@media (max-width: 600px) {
  .card-body {
    padding: 1.25rem 0;
  }

  .login-btn {
    width: 100% !important;
  }
}
</style>