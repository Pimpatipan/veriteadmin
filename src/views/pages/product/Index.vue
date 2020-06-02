<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol lg="6" class="text-center text-lg-left">
        <h1 class="mr-sm-4">PRODUCT MANAGEMENT</h1>
      </CCol>
      <CCol lg="6" class="text-center text-lg-right">
        <b-dropdown id="dropdown-1" class="my-md-2 btn-mains small-dropdown" right no-flip>
          <template v-slot:button-content>ACTION</template>
          <b-dropdown-item href="/product/importdata">Import Data</b-dropdown-item>
          <b-dropdown-item @click="exportData">Export Data</b-dropdown-item>
        </b-dropdown>
        <b-dropdown id="dropdown-form" right ref="dropdown" class="m-2 btn-filter" no-flip>
          <template v-slot:button-content>
            <font-awesome-icon icon="filter" class="mr-2" />FILTER
          </template>

          <div>
            <p class="font-weight-bold mb-2">Status</p>
          </div>

          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="checkbox"
              value
              id="all"
              :checked="checkAll"
              @click="checkAllSelect()"
              v-model="selectAllCb"
            />
            <label class="form-check-label" for="all">All</label>
          </div>
          <div class="row">
            <div class="col-sm-6">
              <div class="form-check">
                <input
                  class="form-check-input"
                  v-model="filter.status"
                  type="checkbox"
                  value="1"
                  id="status1"
                  @change="checkStatusLength"
                />
                <label class="form-check-label" for="status1">Active</label>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-check mt-2 mt-sm-0">
                <input
                  class="form-check-input"
                  v-model="filter.status"
                  type="checkbox"
                  value="0"
                  id="status2"
                  @change="checkStatusLength"
                />
                <label class="form-check-label" for="status2">Inactive</label>
              </div>
            </div>
          </div>
          <div>
            <div class="d-flex mt-3">
              <div>
                <p class="font-weight-bold mb-2">Min Price</p>
                <b-form-input v-model="filter.StartPrice" placeholder="Min Price"></b-form-input>
              </div>
              <div class="mx-2">
                <p class="mt-40">-</p>
              </div>
              <div>
                <p class="font-weight-bold mb-2">Max Price</p>
                <b-form-input v-model="filter.EndPrice" placeholder="Max Price"></b-form-input>
              </div>
            </div>
          </div>
          <div>
            <p class="font-weight-bold my-2">Tag</p>
            <div class="row">
              <div class="col-sm-6" v-for="(item,index) in tag" v-bind:key="index">
                <div class="form-check mb-2">
                  <input
                    class="form-check-input"
                    v-model="filter.NewArrivalHot"
                    type="checkbox"
                    :value="item.id"
                    :id="'tag-'+item.id"
                  />
                  <label class="form-check-label" :for="'tag-'+item.id">{{item.name}}</label>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-3">
            <button type="button" class="btn btn-primary button" @click="getDataByStatus()">Submit</button>
          </div>
        </b-dropdown>
        <router-link to="/product/details/0">
          <button type="button" class="btn btn-success button">CREATE NEW</button>
        </router-link>
      </CCol>
    </CRow>
    <div class="bg-white-border px-4 px-sm-5 py-4 mt-4">
      <b-row class="no-gutters mt-3">
        <b-col lg="6">
          <b-input-group class="panel-input-serach">
            <b-form-input
              class="input-serach"
              placeholder="Name, SKU"
              @keyup="handleSearch"
              v-model="filter.search"
            ></b-form-input>
            <b-input-group-prepend>
              <span class="icon-input m-auto pr-2">
                <font-awesome-icon icon="search" />
              </span>
            </b-input-group-prepend>
          </b-input-group>
        </b-col>
        <b-col lg="6" class="text-center text-sm-right">
          <div class="float-sm-left p-rt-5 px-0 px-lg-3 py-3 py-lg-0">
            <p class="font-weight-bold mb-1 text-body text-left">Sort By</p>
            <b-form-select
              v-model="selected"
              :options="options"
              class="sortByDropdown"
              @change="getList"
            ></b-form-select>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-4 w-100">
          <b-table
            responsive
            striped
            :fields="fields"
            :items="items"
            :busy="isBusy"
            show-empty
            empty-text="No matching records found"
          >
            <template v-slot:cell(imageUrl)="data">
              <div class="position-relative">
                <div
                  class="square-box"
                  v-bind:style="{ 'background-image': 'url(' + data.item.imageUrl + ')' }"
                ></div>
              </div>
            </template>
            <template v-slot:cell(name)="data">
              <div class>
                <div class>
                  <div class="tag-box tb-new" v-if="data.item.isNew">New</div>
                  <div class="tag-box tb-hot" v-if="data.item.isHot">Hot</div>
                </div>

                <p class="mb-0 nobreak two-lines">{{data.item.name}}</p>
              </div>
            </template>
            <template v-slot:cell(price)="data">
              <p class="m-0">{{data.item.price | numeral('0,0.00')}}</p>
            </template>
            <template v-slot:cell(stock)="data">
              <p class="m-0">{{data.item.stock | numeral('0,0')}}</p>
            </template>
            <template v-slot:cell(sku)="data">
              <div v-if="data.item.sku != ''">{{data.item.sku}}</div>
              <div v-else>-</div>
            </template>
            <template v-slot:cell(sortOrder)="data">
              <div v-if="data.item.sortOrder == 0">-</div>
              <div v-else>{{data.item.sortOrder}}</div>
            </template>
            <template v-slot:cell(enabled)="data">
              <div v-if="data.item.enabled == true" class="text-success">Active</div>
              <div v-else class="text-danger">Inactive</div>
            </template>
             <template v-slot:cell(display)="data">
              <div v-if="data.item.display == true" class="text-success">Active</div>
              <div v-else class="text-danger">Inactive</div>
            </template>
            <template v-slot:cell(id)="data">
              <div class="d-flex justify-content-center">
                <router-link :to="'/product/details/'+data.item.id">
                  <b-button variant="link" class="text-warning px-1 py-0">
                    <font-awesome-icon icon="pencil-alt" title="Edit" />
                  </b-button>
                </router-link>
                <b-button
                  variant="link"
                  class="text-danger px-1 py-0"
                  @click="deleteData(data.item.id)"
                >
                  <font-awesome-icon icon="trash-alt" title="Delete" />
                </b-button>
              </div>
            </template>
            <template v-slot:table-busy>
              <div class="text-center text-black my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong class="ml-2">Loading...</strong>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="form-inline justify-content-center justify-content-md-between">
          <b-pagination
            v-model="filter.PageNo"
            :total-rows="rows"
            :per-page="filter.PerPage"
            class="m-md-0"
            @change="pagination"
          ></b-pagination>
          <b-form-select
            v-model="filter.PerPage"
            @change="hanndleChangePerpage"
            :options="pageOptions"
          ></b-form-select>
        </b-col>
      </b-row>
    </div>

    <b-modal
      id="importDataModal"
      ref="importDataModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Import Data</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('importDataModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
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
                v-model="form.base64"
              />

              <p v-if="importerror" class="text-danger">{{error}}</p>
            </b-col>
          </b-row>
          <div class="text-center mt-3">
            <b-button class="btn btn-main" :disabled="isDisable" @click="importData">Submit</b-button>
          </div>
        </b-container>
      </div>
    </b-modal>
  </CContainer>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";
import UploadFile from "@/components/inputs/UploadFile";

export default {
  name: "ProductIndex",
  components: {
    UploadFile
  },
  data() {
    return {
      fields: [
        {
          key: "imageUrl",
          label: "Thumbnail",
          class: "w-100px"
        },
        {
          key: "name",
          label: "Product Name",
          class: "w-100px",
          tdClass: "text-left"
        },
        {
          key: "sku",
          label: "SKU"
        },
        {
          key: "price",
          label: "Price",
          class: "w-100px"
        },
        {
          key: "stock",
          label: "Stock",
          class: "w-100px"
        },
        {
          key: "sortOrder",
          label: "Sort Order"
        },
        {
          key: "enabled",
          label: "Status"
        },
         {
          key: "display",
          label: "Display Status",
          class: "w-100px"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      items: [],
      tag: [],
      isBusy: false,
      isDisable: true,
      importerror: false,
      error: true,
      rows: 0,
      filename: "",
      form: {
        base64: ""
      },
      filter: {
        Status: [],
        Search: "",
        PageNo: 1,
        PerPage: 20,
        NewArrivalHot: [],
        StartPrice: 0,
        EndPrice: 99999,
        SortByOrderOrId: 0
      },
      pageOptions: [
        { value: 20, text: "20 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ],
      checkAll: false,
      selectAllCb: false,
      cbHighlight: false,
      selected: 0,
      options: [
        { value: 0, text: "Please select an option" },
        { value: 1, text: "Sort Order" },
        { value: 2, text: "Created Time" }
      ]
    };
  },
  created: async function() {
    await this.getList();
  },
  methods: {
    getList: async function() {
      this.isBusy = true;
      this.filter.SortByOrderOrId = this.selected;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/list`,
        null,
        this.$headers,
        this.filter
      );

      if (data.result == 1) {
        this.items = data.detail.dataList;
        this.rows = data.detail.count;
        this.isBusy = false;
      }

      let tags = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/filter`,
        null,
        this.$headers,
        null
      );

      if (tags.result == 1) {
        this.tag = tags.detail;
      }
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.pageno = 1;
        this.getList();
      }
    },
    pagination(Page) {
      this.filter.pageno = Page;
      this.getList();
    },
    getDataByStatus() {
      this.$refs.dropdown.hide(true);
      this.getList();
    },
    checkStatusLength() {
      if (this.filter.status.length == 2) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
    },
    checkAllSelect() {
      if (this.selectAllCb) {
        this.filter.status = [];
      } else {
        this.filter.status = [1, 0];
      }
    },
    hanndleChangePerpage(value) {
      this.filter.pageno = 1;
      this.filter.perpage = value;
      this.getList();
    },
    deleteData: async function(id) {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/product/removeProductDetail/` + id,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          location.reload();
        }
      }
    },
    onFileChange(file) {
      this.filename = file.name;
      this.isDisable = false;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.base64 = reader.result;
      };
    },
    deleteFile(value) {
      this.form.base64 = null;
      this.filename = null;
      this.isDisable = true;
    },
    importData: async function(id) {
      this.isDisable = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/importProduct`,
        null,
        this.$headers,
        this.form
      );

      if (data.result == 1) {
        this.$refs["importDataModal"].hide();
        this.form.base64 = null;
        this.filename = null;
        this.getList();
      }
    },
    exportData: async function() {
      axios({
        url: `${this.$baseUrl}/api/product/exportProduct`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: this.filter
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var dateExcel = moment().format("DDMMYYYYhhmmss");

        fileLink.href = fileURL;
        fileLink.setAttribute(
          "download",
          `Product-List-` + dateExcel + `.xlsx`
        );
        document.body.appendChild(fileLink);
        fileLink.click();
      });
    }
  }
};
</script>