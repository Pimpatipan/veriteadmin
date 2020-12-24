<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Store Details</h1>
          </b-col>
        </b-row>

        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4 vh-100" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>

          <b-col class="px-4 px-sm-5 py-4" v-else>
            <b-row class="pl-1 my-3">
              <b-col cols="6">
                <div class="panel d-flex align-items-md-center">
                  <b-form-checkbox
                    size="lg"
                    id="sameLang"
                    class="mt-0 mt-sm-3"
                    @change="useSameLanguage"
                    v-model="form.branch.isSameLanguage"
                  >ใช้เหมือนกันทุกภาษา</b-form-checkbox>
                </div>
              </b-col>
              <b-col cols="6" class="text-right">
                <b-button
                  type="button"
                  class="btn btn-language"
                  v-for="(language, index) in languageList"
                  v-bind:key="index"
                  v-bind:class="[ languageActive == language.id ? 'active' : '' ]"
                  @click="changeLanguage(language.id,index)"
                  :disabled="form.branch.isSameLanguage ? true : false "
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div v-for="(item, index) in form.branch.translationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <InputText
                      textFloat="Store Name"
                      placeholder="Store Name"
                      type="text"
                      name="storename"
                      isRequired
                      v-model="item.name"
                      :img="imageLogoLang"
                      :isValidate="$v.form.branch.translationList.$each.$iter[index].name.$error"
                      :v="$v.form.branch.translationList.$each.$iter[index].name"
                    />
                  </div>
                </div>
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Telephone No."
                  placeholder="Telephone No."
                  type="text"
                  name="telno"
                  isRequired
                  v-model="form.branch.telephone"
                  :isValidate="$v.form.branch.telephone.$error"
                  :v="$v.form.branch.telephone"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <div v-for="(item, index) in form.branch.translationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <InputText
                      textFloat="Address"
                      placeholder="Address"
                      type="text"
                      name="address"
                      isRequired
                      v-model="item.address"
                      :img="imageLogoLang"
                      :isValidate="$v.form.branch.translationList.$each.$iter[index].address.$error"
                      :v="$v.form.branch.translationList.$each.$iter[index].address"
                    />
                  </div>
                </div>
              </b-col>
              <b-col md="6">
                <div v-for="(item, index) in form.branch.translationList" v-bind:key="index">
                  <div v-bind:class="[ languageActive == item.languageId ? '' : 'd-none' ]">
                    <InputText
                      textFloat="Operation Time"
                      placeholder="Operation Time"
                      type="text"
                      name="operationtime"
                      isRequired
                      v-model="item.operationTime"
                      :img="imageLogoLang"
                      :isValidate="$v.form.branch.translationList.$each.$iter[index].operationTime.$error"
                      :v="$v.form.branch.translationList.$each.$iter[index].operationTime"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  class="mb-4"
                  textFloat="Latitude"
                  placeholder="Latitude"
                  type="text"
                  name="name"
                  isRequired
                  v-model="form.branch.latitude"
                  :isValidate="$v.form.branch.latitude.$error"
                  :v="$v.form.branch.latitude"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  class="mb-4"
                  textFloat="Longtitude"
                  placeholder="Longtitude"
                  type="text"
                  name="name"
                  isRequired
                  v-model="form.branch.longtitude"
                  :isValidate="$v.form.branch.longtitude.$error"
                  :v="$v.form.branch.longtitude"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputSelect
                  class="mb-4"
                  title="Province"
                  name="province"
                  v-bind:options="list.provinces"
                  v-on:onDataChange="handleChangeProvince"
                  v-model="form.branch.provinceId"
                  isRequired
                  v-bind:isValidate="$v.form.branch.provinceId.$error"
                  :v="$v.form.branch.provinceId"
                />
              </b-col>
              <b-col md="6">
                <InputSelect
                  class="mb-4"
                  title="District"
                  name="district"
                  v-bind:options="list.districts"
                  v-on:onDataChange="handleChangeDistrict"
                  v-model="form.branch.districtId"
                  isRequired
                  v-bind:isValidate="$v.form.branch.districtId.$error"
                  :v="$v.form.branch.districtId"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputSelect
                  class="mb-4"
                  title="Subdistrict"
                  name="subdistrict"
                  v-bind:options="list.subDistricts"
                  v-on:onDataChange="handleChangeSubDistrict"
                  v-model="form.branch.subdistrictId"
                  isRequired
                  v-bind:isValidate="$v.form.branch.subdistrictId.$error"
                  :v="$v.form.branch.subdistrictId"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Zip Code"
                  placeholder="Zip Code"
                  type="text"
                  name="zipcode"
                  isRequired
                  v-model="form.branch.code"
                  :disabled="true"
                  v-bind:isValidate="$v.form.branch.zipcodeId.$error"
                  :v="$v.form.branch.zipcodeId"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  class="mb-4"
                  textFloat="Sort Order"
                  placeholder="Sort Order"
                  type="text"
                  name="sortorder"
                  isRequired
                  v-model="form.branch.sortOrder"
                />
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="form.branch.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span class="ml-2 main-label">{{form.branch.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
              <b-col md="6">
                <label class="font-weight-bold mt-3 mt-md-0">
                  Store Type
                  <span class="text-danger">*</span>
                </label>

                <div class="store-type-box px-4 mb-2">
                  <b-form-radio
                    v-model="form.branch.branchTypeId"
                    size="lg"
                    class="my-2 radios"
                    v-for="(item,index) in filterList"
                    v-bind:key="index"
                    name="some-radios"
                    :value="item.id"
                  >{{item.name}}</b-form-radio>
                </div>

                <p
                  v-if="$v.form.branch.branchTypeId.$error"
                  class="text-danger"
                >Please select at least one branch type</p>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button
                  class="btn btn-danger btn-details-set mr-md-2"
                  :disabled="isDisable"
                  @click="deleteData()"
                  v-if="isEdit"
                >REMOVE</b-button>
                <b-button href="/store" :disabled="isDisable" class="btn-details-set">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  @click="checkForm(0)"
                  :disabled="isDisable"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                >Save</button>
                <button
                  type="button"
                  @click="checkForm(1)"
                  :disabled="isDisable"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                >Save & Exit</button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </form>
    <ModalAlert
      v-if="modalAlertShow"
      :msg="msgModal"
      :img="imgModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
    />
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import InputSelect from "@/components/inputs/InputSelect";
import { required, numeric, minValue } from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";

export default {
  name: "StoreDetails",
  components: {
    InputText,
    InputSelect,
    ModalAlert
  },
  data() {
    return {
      languageList: [],
      bank: [],
      filterList: [],
      imageLogoLang: "",
      languageActive: 1,
      isEdit: false,
      isLoadingData: false,
      isDisable: false,
      imgModal: null,
      msgModal: null,
      id: this.$route.params.id,
      modalAlertShow: false,
      list: {
        provinces: [],
        districts: [{ value: 0, text: "Please select District" }],
        subDistricts: [
          { value: 0, text: "Please select Sub-District" }
        ]
      },
      form: {
        branch: {
          id: 0,
          enabled: false,
          sortOrder: 0,
          branchTypeId: 0,
          telephone: null,
          zipcodeId: 0,
          latitude: null,
          longtitude: null,
          mainLanguageId: 0,
          isSameLanguage: false,
          provinceId: 0,
          districtId: 0,
          subdistrictId: 0,
          countryId: 0,
          code: 0,
          translationList: [
            {
              languageId: 1,
              name: null,
              address: null,
              operationTime: null
            },
            {
              languageId: 2,
              name: null,
              address: null,
              operationTime: null
            }
          ]
        }
      }
    };
  },
  validations: {
    form: {
      branch: {
        branchTypeId: { required, numeric, minValue: minValue(1) },
        telephone: { required },
        latitude: { required },
        longtitude: { required },
        districtId: {
          required,
          numeric,
          minValue: minValue(1)
        },
        subdistrictId: {
          required,
          numeric,
          minValue: minValue(1)
        },
        provinceId: {
          required,
          numeric,
          minValue: minValue(1)
        },
        zipcodeId: {
          required,
          numeric,
          minValue: minValue(1)
        },
        translationList: {
          $each: {
            name: { required },
            address: { required },
            operationTime: { required }
          }
        }
      }
    }
  },
  created: async function() {
    await this.getDatas();
    await this.getFilter();
  },
  methods: {
    isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/store";
      } else {
        if (this.id > 0) {
          this.getDatas();
        } else {
          this.form.branch.id = this.existId;
          this.id = this.existId;
          this.isEdit = true;
          this.$router.push({ path: `/store/details/${this.existId}` });
        }
      }
    },
    getDatas: async function() {
      this.isLoadingData = true;

      let languages = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/language`,
        null,
        this.$headers,
        null
      );

      if (languages.result == 1) {
        this.languageList = languages.detail;
        this.changeLanguage(1, 0);
      }

      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/branch/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.form = data.detail;
        this.isLoadingData = false;
        this.$v.form.$reset();

        if (this.form.branch.id > 0) {
          this.isEdit = true;
        }

        if (this.form.branch.isSameLanguage) {
          this.imageLogoLang = "";
        } else {
          var index = this.languageList
            .map(function(x) {
              return x.id;
            })
            .indexOf(this.languageActive);
          this.imageLogoLang = this.languageList[index].imageUrl;
        }
      }

      await this.loadDataProvinces();

      await this.handleChangeProvince(
        this.form.branch.provinceId,
        this.form.branch.districtId,
        this.form.branch.subdistrictId
      );
      await this.handleChangeDistrict(
        this.form.branch.districtId,
        this.form.branch.subdistrictId
      );

      await this.handleChangeSubDistrict(this.form.branch.subdistrictId);
      await this.setZipCode(this.form.branch.subdistrictId);
    },
    getFilter: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/branch/branchType`,
        null,
        this.$headers,
        null
      );
      if (data.result == 1) {
        this.filterList = data.detail;
      }
    },
    loadDataProvinces: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/address/province`,
        null,
        this.$headers,
        null
      );
      let list = [{ value: 0, text: "Please select Province" }];
      let provinces = data.detail;
      provinces = provinces.map(obj => {
        return {
          value: obj.id,
          text: obj.name
        };
      });
      this.list.provinces = list.concat(provinces);
    },
    setZipCode: async function(subdistrictId = 0) {
      if (subdistrictId) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/zipcode/${subdistrictId}`,
          null,
          this.$headers,
          null
        );

        this.form.branch.code = data.detail.name;
        this.form.branch.zipcodeId = data.detail.id;
      } else {
        this.form.branch.code = "";
        this.form.branch.zipcodeId = 0;
      }
    },
    handleChangeSubDistrict: async function(value, zipCodeId = "") {
      this.form.branch.subdistrictId = value;
      await this.setZipCode(this.form.branch.subdistrictId);
    },
    handleChangeDistrict: async function(value, subdistrictId = 0) {
      this.form.branch.districtId = value;

      let list = [{ value: 0, text: "Please select District" }];
      let subDistricts = [];
      if (value) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/subdistrict/${this.form.branch.districtId}`,
          null,
          this.$headers,
          null
        );
        subDistricts = data.detail;
        subDistricts = subDistricts.map(obj => {
          return {
            value: obj.id,
            text: obj.name
          };
        });
      }
      this.list.subDistricts = await list.concat(subDistricts);
      this.form.branch.subdistrictId = subdistrictId;
      await this.setZipCode(this.form.branch.subdistrictId);
    },
    handleChangeProvince: async function(
      value,
      districtId = 0,
      subdistrictId = 0
    ) {
      this.form.branch.provinceId = value;
      // this.form.branch.districtId = "";
      // this.form.branch.subdistrictId = "";

      let list = [{ value: 0, text: "Please select District" }];
      let districts = [];
      if (value) {
        let data = await this.$callApi(
          "get",
          `${this.$baseUrl}/api/address/district/${this.form.branch.provinceId}`,
          null,
          this.$headers,
          null
        );
        districts = data.detail;
        districts = districts.map(obj => {
          return {
            value: obj.id,
            text: obj.name
          };
        });
      }
      this.list.districts = await list.concat(districts);
      this.form.branch.districtId = districtId;
      this.form.branch.subdistrictId = subdistrictId;
      await this.setZipCode(this.form.branch.subdistrictId);
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    },
    useSameLanguage: async function() {
      Vue.nextTick(() => {
        if (this.form.branch.isSameLanguage) {
          this.imageLogoLang = "";
          this.form.branch.mainLanguageId = this.languageActive;
          let data = this.form.branch.translationList.filter(
            val => val.languageId == this.form.branch.mainLanguageId
          );

          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              for (
                let index = 0;
                index < this.form.branch.translationList.length;
                index++
              ) {
                this.form.branch.translationList[index].name = data.name;
                this.form.branch.translationList[index].address = data.address;
                this.form.branch.translationList[index].operationTime =
                  data.operationTime;
              }
            }
          }
        } else {
          var index = this.languageList
            .map(function(x) {
              return x.id;
            })
            .indexOf(this.languageActive);
          this.imageLogoLang = this.languageList[index].imageUrl;

          let data = this.form.branch.translationList.filter(
            val => val.languageId != this.form.branch.mainLanguageId
          );
          if (this.id == 0) {
            if (data.length == 1) {
              data = data[0];
              data.name = "";
              data.address = "";
              data.operationTime = "";
            }
          }
        }
      });
    },
    checkValidateTranslationList: async function() {
      let isError = false;
      this.languageList.forEach((element, index) => {
        if (!isError) {
          if (this.$v.form.branch.translationList.$each.$iter[index].$error) {
            this.languageActive = this.$v.form.branch.translationList.$model[
              index
            ].languageId;

            this.imageLogoLang = this.languageList[index].imageUrl;

            isError = true;
          }
        }
      });
    },
    checkForm: async function(flag) {
      if (this.form.branch.isSameLanguage) {
        await this.useSameLanguage();
      }
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        await this.checkValidateTranslationList();
        return;
      }
      this.modalAlertShow = false;
      this.flag = flag;
      this.submit();
    },
    submit: async function() {
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/branch/saveBranch`,
        null,
        this.$headers,
        this.form
      );

      this.modalAlertShow = true;
      if (data.result == 1) {
        this.imgModal = "/img/icon-check-green.png";
        this.msgModal = data.message;
        this.isSuccess = true;
        this.existId = data.detail.id;
      } else {
        this.imgModal = "/img/icon-unsuccess.png";
        this.msgModal = data.message;
        this.isSuccess = false;
      }

      this.isDisable = false;
    },
    deleteData: async function() {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/branch/removeBranch/${this.id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          window.location.href = "/store";
        }
      }
    }
  }
};
</script>

<style scoped>
label {
  color: #16274a;
  font-size: 17px;
  margin-bottom: 2px;
  font-weight: bold;
}

.store-type-box {
  border: 1px solid #bcbcbc;
  height: 210px;
  overflow-y: auto;
}

.radios {
  font-size: 16px;
  line-height: 1.9;
}
</style>