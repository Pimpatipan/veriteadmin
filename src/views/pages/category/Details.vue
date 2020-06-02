<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Category Details</h1>
          </b-col>
        </b-row>

        <b-row class="no-gutters bg-white-border mt-4">
          <b-col class="px-4 px-sm-5 py-4">
            <b-row class="pl-1 my-3">
              <b-col md="6">
                <div class="panel d-flex align-items-md-center">
                  <b-form-checkbox size="lg" id="sameLang" class="mt-3">ใช้เหมือนกันทุกภาษา</b-form-checkbox>
                </div>
              </b-col>
              <b-col md="6" class="text-right">
                <b-button
                  type="button"
                  class="btn btn-language"
                  v-for="(language, index) in languageList"
                  v-bind:key="index"
                  v-bind:class="[ languageActive == language.id ? 'active' : '' ]"
                  @click="changeLanguage(language.id,index)"
                >
                  <span class="text-uppercase">{{language.nation}}</span>
                </b-button>
              </b-col>
            </b-row>

            <InputText
              class="mb-4"
              textFloat="Category Name"
              placeholder="Category Name"
              type="text"
              name="name"
              isRequired
              :img="imageLogoLang"
            />

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="URL Key"
                  placeholder="URL Key"
                  type="text"
                  name="urlkey"
                  isRequired
                  :img="imageLogoLang"
                />
                 <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <!-- <div>
                  <b-form-checkbox
                    switch
                    v-model="form.blog.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span class="ml-2 main-label">{{form.blog.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>-->
              </b-col>
              <b-col md="6">
                <label class="font-weight-bold label-text">
                  Parent Category
                  <span class="text-danger">*</span>
                </label>

                <div class="store-type-box px-4 mb-4">
                  <Checkbox id text="By Concern" class="my-3"></Checkbox>
                  <Checkbox id text="By Concern" class="my-3"></Checkbox>
                  <Checkbox id text="By Concern" class="my-3"></Checkbox>
                  <Checkbox id text="By Concern" class="my-3"></Checkbox>
                </div>
              </b-col>
            </b-row>

            <HeaderLine text="Product list" class="my-4" />

            <div class="text-right">
              <b-button class="btn-main mb-3"  @click="$bvModal.show('addProductModal')">ADD</b-button>
            </div>

            <div>
              <b-table
                striped
                responsive
                hover
                :items="items"
                :fields="fields"
                :busy="isBusy"
                show-empty
                empty-text="No matching records found"
              >
                <template v-slot:cell(createdTime)="data">
                  <span>{{ new Date(data.item.createdTime) | moment($formatDate) }}</span>
                </template>
                <template v-slot:cell(receiptNo)="data">
                  <div v-if="data.item.receiptNo != ''">{{data.item.receiptNo}}</div>
                  <div v-else>{{data.item.quotationNo}}</div>
                </template>
                <template v-slot:cell(paymentChanel)="data">
                  <div>
                    <p class="m-0">{{data.item.paymentChanel}}</p>
                    <p class="m-0" v-if="data.item.paymentRef != null">{{data.item.paymentRef}}</p>
                  </div>
                </template>
                <template v-slot:cell(amount)="data">
                  <div>
                    <p class="m-0">{{ data.item.amount | numeral('0,0.00') }}</p>
                  </div>
                </template>
                <template v-slot:cell(id)="data">
                  <div class="d-flex justify-content-center">
                    <router-link :to="'/order/details/'+data.item.id">
                      <b-button variant="link" class="text-body text-underline">View</b-button>
                    </router-link>
                  </div>
                </template>
                <template v-slot:table-busy>
                  <div class="text-center text-black my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong class="ml-2">Loading...</strong>
                  </div>
                </template>
              </b-table>
            </div>
            <b-row>
              <b-col class="form-inline justify-content-center justify-content-md-between">
                <b-pagination
                  v-model="filter.pageNo"
                  :total-rows="rows"
                  :per-page="filter.perPage"
                  class="m-md-0"
                  @change="pagination"
                ></b-pagination>
                <b-form-select
                  @change="hanndleChangePerpage"
                  v-model="filter.perPage"
                  :options="pageOptions"
                ></b-form-select>
              </b-col>
            </b-row>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button class="btn btn-danger btn-details-set">REMOVE</b-button>
                <b-button href="/banner" class="btn-details-set ml-md-2">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                >Save</button>
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                >Save & Exit</button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </form>
    <b-modal
      id="addProductModal"
      ref="addProductModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      size="lg"
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Product List</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('addProductModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col md="7">
              <b-input-group class="panel-input-serach">
                <b-form-input
                  class="input-serach"
                  placeholder="Product Name"
                  v-model="filter.search"
                ></b-form-input>
                <b-input-group-prepend>
                  <span class="icon-input m-auto pr-2">
                    <font-awesome-icon icon="search" />
                  </span>
                </b-input-group-prepend>
              </b-input-group>
            </b-col>
            <b-col md="5" class="text-sm-right">
              <b-dropdown
                id="dropdown-form"
                right
                ref="dropdown"
                class="my-2 btn-filter w-500"
                no-flip
              >
                <template v-slot:button-content>
                  <font-awesome-icon icon="filter" class="mr-2" />FILTER
                </template>
              </b-dropdown>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                responsive
                striped
                :fields="productfields"
                :items="productitems"
                :busy="isBusy"
                show-empty
                empty-text="No matching records found"
                class="mt-4"
              ></b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="form-inline justify-content-center justify-content-md-between">
              <b-pagination
                v-model="filter.pageno"
                :total-rows="rows"
                :per-page="filter.perpage"
                class="m-md-0"
                @change="pagination"
              ></b-pagination>
              <b-form-select
                v-model="filter.perpage"
                @change="hanndleChangePerpage"
                :options="pageOptions"
              ></b-form-select>
            </b-col>
          </b-row>
        </b-container>
      </div>
      <div class="text-center mt-3">
        <b-button class="btn btn-main" :disabled="isDisable" @click="updateTrackingNo">Submit</b-button>
        <!-- <b-button class="btn btn-sub float-left" @click="closeUpdateTrackModal">Close</b-button> -->
      </div>
    </b-modal>
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import UploadFile from "@/components/inputs/UploadFile";
import Checkbox from "@/components/inputs/InputCheckBox";
import HeaderLine from "@/components/HeaderLine";

export default {
  name: "BannerDetails",
  components: {
    InputText,
    UploadFile,
    Checkbox,
    HeaderLine
  },
  data() {
    return {
      languageList: [],
      items: [],
      imageLogoLang: "",
      languageActive: 1,
      fields: [
        {
          key: "createdTime",
          label: "Product Name",
          class: "w-100px"
        },
        {
          key: "receiptNo",
          label: "Last Update"
        },
        {
          key: "amount",
          label: "Action"
        }
      ],
      filter: {
        perPage: 10,
        pageNo: 1
      }
    };
  },
  created: async function() {
    await this.getDatas();
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
    getDatas: async function() {
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
    },
    changeLanguage(id, index) {
      this.languageActive = id;
      this.imageLogoLang = this.languageList[index].imageUrl;
    }
  }
};
</script>

<style scoped>
.panel {
  font-size: 17px;
  color: #16274a;
}
.store-type-box {
  border: 1px solid #bcbcbc;
  height: 150px;
  overflow-y: auto;
}
::v-deep .custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: #bcbcbc;
  background-color: #16274a;
}
::v-deep
  .custom-control-input:focus:not(:checked)
  ~ .custom-control-label::before {
  cursor: pointer !important;
  border-color: #bcbcbc;
}
::v-deep .custom-control-input:focus ~ .custom-control-label::before {
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}
::v-deep .custom-checkbox.b-custom-control-lg > label,
::v-deep .input-group-lg .custom-checkbox > label {
  font-size: 17px;
  color: #16274a;
  line-height: 24px;
}
::v-deep .custom-checkbox.b-custom-control-lg .custom-control-label::before,
::v-deep .input-group-lg .custom-checkbox .custom-control-label::before,
::v-deep .custom-checkbox.b-custom-control-lg .custom-control-label::after,
::v-deep .input-group-lg .custom-checkbox .custom-control-label::after {
  top: 3px;
}
</style>