<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol lg="6" class="text-center text-lg-left">
        <h1 class="mr-sm-4">USER MANAGEMENT</h1>
      </CCol>
      <CCol lg="6" class="text-center text-lg-right">
        <b-button class="btn btn-main mr-2" @click="exportData">EXPORT</b-button>
        <b-dropdown id="dropdown-form" right ref="dropdown" class="my-2 mr-2 btn-filter" no-flip="">
          <template v-slot:button-content>
            <font-awesome-icon icon="filter" class="mr-2" />FILTER
          </template>

          <div>
            <p class="font-weight-bold mb-2">Verified</p>
            <div class="form-check">
              <input class="form-check-input" v-model="isVerified" type="checkbox" id="verifiedCb" />
              <label class="form-check-label" for="verifiedCb">Show only verified user</label>
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
            <div class="col-sm-6">
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
            <div class="col-sm-6">
              <div class="form-check mt-2 mt-sm-0">
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
            <div class="col-sm-6">
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
          <div class="text-center mt-3">
            <button type="button" class="btn btn-primary button" @click="getDataByStatus()">Submit</button>
          </div>
        </b-dropdown>
        <router-link to="/user/details/0">
          <button type="button" class="btn btn-success button">CREATE NEW</button>
        </router-link>
      </CCol>
    </CRow>
    <div class="bg-white-border px-4 px-sm-5 py-4 mt-4">
      <b-row class="no-gutters mt-3">
        <b-col md="6">
          <b-input-group class="panel-input-serach">
            <b-form-input
              class="input-serach"
              placeholder="์Name Lastname, Telephone, Email"
              v-model="filter.search"
              @keyup="handleSearch"
            ></b-form-input>
            <b-input-group-prepend>
              <span class="icon-input m-auto pr-2">
                <font-awesome-icon icon="search" />
              </span>
            </b-input-group-prepend>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="mt-4">
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
              <div v-else>{{data.item.firstname}} {{data.item.lastname}}</div>
            </template>
            <template v-slot:cell(genderName)="data">
              <div v-if="data.item.genderName == null">-</div>
              <div v-else>{{data.item.genderName}}</div>
            </template>
            <template v-slot:cell(telephone)="data">
              <div v-if="data.item.telephone == null">-</div>
              <div v-else>{{data.item.telephone}}</div>
            </template>
            <template v-slot:cell(birthday)="data">
              <span>{{ new Date(data.item.birthday) | moment($formatDate) }}</span>
            </template>
            <template v-slot:cell(isVerified)="data">
              <div v-if="data.item.isVerified == true" class="text-success">Verified</div>
              <div v-else class="text-danger">Not Verified</div>
            </template>
            <template v-slot:cell(userGUID)="data">
              <div class="d-flex justify-content-center">
                <router-link :to="'/user/details/'+data.item.userGUID">
                  <b-button variant="link" class="text-warning px-1 py-0">
                    <font-awesome-icon icon="eye" title="View" />
                  </b-button>
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
        </b-col>
      </b-row>
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
            v-model="filter.perPage"
            @change="hanndleChangePerpage"
            :options="pageOptions"
          ></b-form-select>
        </b-col>
      </b-row>
    </div>
  </CContainer>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";

export default {
  name: "UserIndex",
  data() {
    return {
      fields: [
        {
          key: "firstname",
          label: "Name Lastname",
          class: "w-100px"
        },
        {
          key: "telephone",
          label: "Telephone",
          class: "w-100px"
        },
        {
          key: "email",
          label: "Email",
          class: "w-100px"
        },
        {
          key: "genderName",
          label: "Gender"
        },
        {
          key: "birthday",
          label: "Birthday",
          class: "w-100px"
        },
        {
          key: "isVerified",
          label: "Verified",
          class: "w-100px"
        },
        {
          key: "userGUID",
          label: "Action",
          class: "w-100px"
        }
      ],
      items: [],
      isBusy: false,
      checkAll: false,
      selectAllCb: false,
      isVerified: false,
      rows: 0,
      filter: {
        search: "",
        pageNo: 1,
        perPage: 10,
        verified: [],
        genderId: []
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ]
    };
  },
  created: async function() {
    await this.getList();
  },
  methods: {
    getList: async function() {
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
      this.$refs.dropdown.hide(true);
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
    exportData: async function() {
      axios({
        url: `${this.$baseUrl}/api/customer/export`,
        method: "post",
        headers: this.$headers,
        responseType: "blob",
        data: this.filter
      }).then(response => {
        var fileURL = window.URL.createObjectURL(new Blob([response.data]));
        var fileLink = document.createElement("a");
        var dateExcel = moment().format("DDMMYYYYhhmmss");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", `User-List-` + dateExcel + `.xlsx`);
        document.body.appendChild(fileLink);
        fileLink.click();
      });
    }
  }
};
</script>