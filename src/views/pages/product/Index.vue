<template>
  <CContainer class="min-vh-100">
    <CRow class="no-gutters px-3 px-sm-0">
      <b-col cols="6" sm="4">
        <h1 class="mr-sm-4 header">PRODUCT</h1>
      </b-col>
      <b-col cols="6" sm="8" class="text-right">
        <b-dropdown id="dropdown-1" class="btn-mains small-dropdown mr-2" right no-flip>
          <template v-slot:button-content>
            <font-awesome-icon icon="ellipsis-v" title="filter-btn" class="text-white d-sm-none" />
            <span class="d-none d-sm-inline">ACTION</span>
          </template>
          <b-dropdown-item href="/product/importdata">Import Data</b-dropdown-item>
          <b-dropdown-item @click="exportData">Export Data</b-dropdown-item>
          <b-dropdown-item @click="downloadTemplate" class="wrap-normal">Download Product Template</b-dropdown-item>
        </b-dropdown>
        <b-button v-b-toggle.sidebar-1 class="mr-2 btn-filter">
          <font-awesome-icon icon="filter" title="filter-btn" class="text-white mr-0 mr-sm-1" />
          <span class="d-none d-sm-inline">FILTER</span>
        </b-button>
        <router-link to="/product/details/0">
          <button type="button" class="btn btn-success button btn-mobile">
            <font-awesome-icon icon="plus" class="text-white d-sm-none" />
            <span class="d-none d-sm-block">CREATE NEW</span>
          </button>
        </router-link>
      </b-col>
    </CRow>
    <b-sidebar
      id="sidebar-1"
      title="FILTER"
      backdrop
      shadow
      backdrop-variant="dark"
      right
      ref="filterSidebar"
    >
      <div class="px-3 py-2">
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
          <div class="col-6">
            <div class="form-check">
              <input
                class="form-check-input"
                v-model="filter.Status"
                type="checkbox"
                value="1"
                id="status1"
                @change="checkStatusLength"
              />
              <label class="form-check-label" for="status1">Active</label>
            </div>
          </div>
          <div class="col-6">
            <div class="form-check">
              <input
                class="form-check-input"
                v-model="filter.Status"
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
              <b-form-input
                v-model="filter.StartPrice"
                @keypress="isNumber($event)"
                placeholder="Min Price"
              ></b-form-input>
            </div>
            <div class="mx-2">
              <!-- <p class="mt-40">-</p> -->
            </div>
            <div>
              <p class="font-weight-bold mb-2">Max Price</p>
              <b-form-input
                v-model="filter.EndPrice"
                @keypress="isNumber($event)"
                placeholder="Max Price"
              ></b-form-input>
            </div>
          </div>
        </div>
        <div>
          <p class="font-weight-bold my-2">Tag</p>
          <div class="row">
            <div class="col-6" v-for="(item,index) in tag" v-bind:key="index">
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

        <b-row class="no-gutters">
          <b-col>
            <div class="my-3">
              <p class="font-weight-bold mb-2">Sort By</p>
            </div>

            <b-form-select v-model="selected" :options="options" class="sortByDropdown"></b-form-select>
          </b-col>
        </b-row>

        <div class="text-center mt-4">
          <button
            type="button"
            class="btn bg-main-color text-white button"
            @click="getDataByStatus"
          >Submit</button>
        </div>
      </div>
    </b-sidebar>
    <div class="bg-white-border px-4 px-sm-5 pb-4 mt-3">
      <b-row class="no-gutters mt-3">
        <b-col lg="6">
          <b-input-group class="panel-input-serach">
              <b-form-input class="input-serach" @keyup="handleSearch" placeholder="Name, SKU" v-model="filter.search"></b-form-input>
              <b-input-group-prepend>
                <span class="icon-input m-auto pr-2">
                  <font-awesome-icon icon="search" />
                </span>
              </b-input-group-prepend>
            </b-input-group>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
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
              <p
                class="m-0"
                v-if="data.item.advancePrice > 0"
                style=" text-decoration: line-through"
              >{{data.item.price | numeral('0,0.00')}}</p>
              <p
                class="m-0"
                v-if="data.item.advancePrice == 0"
              >{{data.item.price | numeral('0,0.00')}}</p>
              <p class="m-0 text-danger" v-else>{{data.item.advancePrice | numeral('0,0.00')}}</p>
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

    <ModalAlert
      v-if="modalAlertShow"
      :msg="msgModal"
      :img="imgModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
      :hideClose="hideClose"
    />
  </CContainer>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";
import UploadFile from "@/components/inputs/UploadFile";
import ModalAlert from "@/components/ModalAlert";

export default {
  name: "ProductIndex",
  components: {
    UploadFile,
    ModalAlert
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
      modalAlertShow: false,
      imgModal: null,
      msgModal: null,
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
      this.modalAlertShow = false;
    },
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
      this.$refs.filterSidebar.hide();
      this.getList();
    },
    checkStatusLength() {
      if (this.filter.Status.length == 2) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
    },
    checkAllSelect() {
      if (this.selectAllCb) {
        this.filter.Status = [];
      } else {
        this.filter.Status = [1, 0];
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
    exportData: async function() {
      this.modalAlertShow = true;
      this.imgModal = "/img/loading.svg";
      this.msgModal = "In progress. Exporting Data...";
      this.isSuccess = true;
      this.hideClose = true;

      axios({
        url: `${this.$baseUrl}/api/product/exportProduct`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: this.filter
      })
        .then(response => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var dateExcel = moment().format("DDMMYYYYhhmmss");

          this.modalAlertShow = false;

          fileLink.href = fileURL;
          fileLink.setAttribute(
            "download",
            `Product-List-` + dateExcel + `.xlsx`
          );
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.imgModal = "/img/icon-unsuccess.png";
            this.msgModal =
              "Internal Server Error. Please contact system administrator";
            this.hideClose = false;
          }
        });
    },
    downloadTemplate: async function() {
      this.modalAlertShow = true;
      this.imgModal = "/img/loading.svg";
      this.msgModal = "In progress. Exporting Data...";
      this.isSuccess = true;
      this.hideClose = true;

      axios({
        url: `${this.$baseUrl}/api/product/exportProductTemplate`,
        method: "get",
        headers: this.$headers,
        responseType: "blob"
      })
        .then(response => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var dateExcel = moment().format("DDMMYYYYhhmmss");

          this.modalAlertShow = false;

          fileLink.href = fileURL;
          fileLink.setAttribute(
            "download",
            `Product-Template-List-` + dateExcel + `.xlsx`
          );
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch(error => {
          if (error.response.status === 500) {
            this.imgModal = "/img/icon-unsuccess.png";
            this.msgModal =
              "Internal Server Error. Please contact system administrator";
            this.hideClose = false;
          }
        });
    }
  }
};
</script>