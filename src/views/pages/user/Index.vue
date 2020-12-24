<template>
  <CContainer class="min-vh-100">
    <CRow class="no-gutters px-3 px-sm-0">
      <b-col cols="6" sm="4">
        <h1 class="mr-sm-4 header">USER</h1>
      </b-col>
      <b-col cols="6" sm="8" class="text-right">
        <b-button class="btn btn-main btn-mobile mr-2" @click="exportData">
          <font-awesome-icon
            icon="file-download"
            class="text-white d-sm-none"
          />
          <span class="d-none d-sm-block">EXPORT</span>
        </b-button>
        <b-button v-b-toggle.sidebar-1 class="mr-2 btn-filter">
          <font-awesome-icon
            icon="filter"
            title="filter-btn"
            class="text-white mr-0 mr-sm-1"
          />
          <span class="d-none d-sm-inline">FILTER</span>
        </b-button>
        <router-link to="/user/details/0">
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
          <p class="font-weight-bold mb-2">Verified</p>
          <div class="form-check">
            <input
              class="form-check-input"
              v-model="isVerified"
              type="checkbox"
              id="verifiedCb"
            />
            <label class="form-check-label" for="verifiedCb"
              >Show only verified user</label
            >
          </div>
        </div>

        <div>
          <p class="font-weight-bold mt-3 mb-2">Gender</p>
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
                v-model="filter.genderId"
                type="checkbox"
                value="1"
                id="status1"
                @change="checkGenderLength"
              />
              <label class="form-check-label" for="status1">Male</label>
            </div>
          </div>
          <div class="col-6">
            <div class="form-check">
              <input
                class="form-check-input"
                v-model="filter.genderId"
                type="checkbox"
                value="2"
                id="status2"
                @change="checkGenderLength"
              />
              <label class="form-check-label" for="status2">Female</label>
            </div>
          </div>
          <div class="col-6">
            <div class="form-check mt-2">
              <input
                class="form-check-input"
                v-model="filter.genderId"
                type="checkbox"
                value="3"
                id="status3"
                @change="checkGenderLength"
              />
              <label class="form-check-label" for="status3">N/A</label>
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <button
            type="button"
            class="btn bg-main-color text-white button"
            @click="getDataByStatus"
          >
            Submit
          </button>
        </div>
      </div>
    </b-sidebar>
    <div class="bg-white-border px-4 px-sm-5 py-4 mt-3">
      <b-row class="no-gutters mt-3">
        <b-col lg="6">
          <b-input-group class="panel-input-serach">
            <b-form-input
              class="input-serach"
              @keyup="handleSearch"
              placeholder="Name Lastname, Telephone, Email"
              v-model="filter.search"
            ></b-form-input>
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
            <template v-slot:cell(firstname)="data">
              <div v-if="data.item.firstname == null">- -</div>
              <div v-else>
                {{ data.item.firstname }} {{ data.item.lastname }}
              </div>
            </template>
            <template v-slot:cell(genderName)="data">
              <div v-if="data.item.genderName == null">-</div>
              <div v-else>{{ data.item.genderName }}</div>
            </template>
            <template v-slot:cell(telephone)="data">
              <div v-if="data.item.telephone == null">-</div>
              <div v-else>{{ data.item.telephone }}</div>
            </template>
            <template v-slot:cell(channelName)="data">
              <div v-if="data.item.channelName == null">-</div>
              <div v-else>{{ data.item.channelName }}</div>
            </template>
            <template v-slot:cell(birthday)="data">
              <span>{{
                new Date(data.item.birthday) | moment($formatDate)
              }}</span>
            </template>
            <template v-slot:cell(isVerified)="data">
              <div v-if="data.item.isVerified == true" class="text-success">
                Verified
              </div>
              <div v-else class="text-danger">Not Verified</div>
            </template>
                 <template v-slot:cell(isSubscribe)="data">
                <div v-if="data.item.isSubscribe == true" class="text-success">
                  <font-awesome-icon icon="check" title="display" />
                </div>
                <div v-else class="text-danger">
                  <font-awesome-icon icon="times" title="not display" />
                </div>
              </template>
            <template v-slot:cell(userGUID)="data">
              <div class="d-flex justify-content-center">
                <router-link :to="'/user/details/' + data.item.userGUID">
                  <b-button variant="link" class="text-warning px-1 py-0">
                    <font-awesome-icon icon="pencil-alt" title="View" />
                  </b-button>
                </router-link>
                <b-button
                  variant="link"
                  class="text-danger px-1 py-0"
                  @click="deleteData(data.item.userGUID)"
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
        <b-col
          class="form-inline justify-content-center justify-content-md-between"
        >
          <b-pagination
            v-model="filter.pageNo"
            :total-rows="rows"
            :per-page="filter.perPage"
            class="m-md-0"
            @change="pagination"
          ></b-pagination>
          <b-form-select
            v-model="filter.perPage"
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
import ModalAlert from "@/components/ModalAlert";

export default {
  name: "UserIndex",
  components: {
    ModalAlert,
  },
  data() {
    return {
      fields: [
        {
          key: "firstname",
          label: "Name Lastname",
          class: "w-100px",
        },
        {
          key: "telephone",
          label: "Telephone",
          class: "w-100px",
        },
        {
          key: "email",
          label: "Email",
          class: "w-100px",
        },
        {
          key: "genderName",
          label: "Gender",
        },
        {
          key: "birthday",
          label: "Birthday",
          class: "w-100px",
        },
        {
          key: "channelName",
          label: "Channel",
        },
        {
          key: "isSubscribe",
          label: "Subscribe",
        },
        {
          key: "isVerified",
          label: "Verified",
          class: "w-100px",
        },
        {
          key: "userGUID",
          label: "Action",
        },
      ],
      items: [],
      isBusy: false,
      checkAll: false,
      selectAllCb: false,
      isVerified: false,
      modalAlertShow: false,
      imgModal: null,
      msgModal: null,
      rows: 0,
      filter: {
        search: "",
        pageNo: 1,
        perPage: 10,
        verified: [],
        genderId: [],
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" },
      ],
    };
  },
  created: async function () {
    await this.getList();
  },
  methods: {
    handleCloseModal: function () {
      this.modalAlertShow = false;
    },
    getList: async function () {
      this.isBusy = true;

      this.filter.verified = [];

      if (this.isVerified) {
        this.filter.verified.push(1);
      } else {
        this.filter.verified = [];
      }

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/customer/list`,
        null,
        this.$headers,
        this.filter
      );
      if (data.result == 1) {
        this.items = data.detail.userProfileList;
        this.rows = data.detail.count;
        this.isBusy = false;

        if (this.items.firstname == null || this.items.lastname == null) {
          this.isNameNull == true;
        } else {
          this.isNameNull == false;
        }
      }
    },
    pagination(Page) {
      this.filter.pageNo = Page;
      this.getList();
    },
    hanndleChangePerpage(value) {
      this.filter.pageNo = 1;
      this.filter.perPage = value;
      this.getList();
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.pageno = 1;
        this.getList();
      }
    },
    getDataByStatus() {
      this.$refs.filterSidebar.hide(true);
      this.getList();
    },
    checkGenderLength() {
      if (this.filter.genderId.length == 3) {
        this.selectAllCb = true;
      } else {
        this.selectAllCb = false;
      }
    },
    checkAllSelect() {
      if (this.selectAllCb) {
        this.filter.genderId = [];
      } else {
        this.filter.genderId = [1, 2, 3];
      }
    },
    exportData: async function () {
      this.modalAlertShow = true;
      this.imgModal = "/img/loading.svg";
      this.msgModal = "In progress. Exporting Data...";
      this.isSuccess = true;
      this.hideClose = true;

      axios({
        url: `${this.$baseUrl}/api/customer/export`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: this.filter,
      })
        .then((response) => {
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");
          var dateExcel = moment().format("DDMMYYYYhhmmss");

          this.modalAlertShow = false;

          fileLink.href = fileURL;
          fileLink.setAttribute("download", `User-List-` + dateExcel + `.xlsx`);
          document.body.appendChild(fileLink);
          fileLink.click();
        })
        .catch((error) => {
          if (error.response.status === 500) {
            this.imgModal = "/img/icon-unsuccess.png";
            this.msgModal =
              "Internal Server Error. Please contact system administrator";
            this.hideClose = false;
          }
        });
    },
    deleteData: async function (id) {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/customer/` + id,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          location.reload();
        }
      }
    },
  },
};
</script>