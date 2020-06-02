<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol sm="6" class="text-center text-sm-left">
        <h1 class="mr-sm-4">ADMIN MANAGEMENT</h1>
      </CCol>
      <CCol sm="6" class="text-center text-sm-right">
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
          <div class="text-center mt-3">
            <button type="button" class="btn btn-primary button" @click="getDataByStatus()">Submit</button>
          </div>
        </b-dropdown>
        <router-link to="/admin/details/0">
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
              placeholder="์Name Lastname, Telephone, Email"
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
            <template v-slot:cell(firstname)="data">
              <div>{{data.item.firstname}} {{data.item.lastname}}</div>
            </template>
            <template v-slot:cell(enabled)="data">
              <div v-if="data.item.enabled == 1" class="text-success">Active</div>
              <div v-else class="text-danger">Inactive</div>
            </template>
            <template v-slot:cell(telephone)="data">
              <div v-if="data.item.telephone == null">-</div>
              <div v-else>{{data.item.telephone}}</div>
            </template>
            <template v-slot:cell(userGUID)="data">
              <div class="d-flex justify-content-center">
                <router-link :to="'/admin/details/'+data.item.userGUID">
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
export default {
  name: "AdminIndex",
  data() {
    return {
      fields: [
        {
          key: "firstname",
          label: "Name - Lastname",
          class: "w-100px"
        },
        {
          key: "telephone",
          label: "Telephone",
          class: "w-100px"
        },
        {
          key: "email",
          label: "Username",
          class: "w-100px"
        },
        {
          key: "enabled",
          label: "Status",
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
      rows: 0,
      filter: {
        perPage: 10,
        pageNo: 1,
        status: [],
        search: ""
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
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

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/admin/list`,
        null,
        this.$headers,
        this.filter
      );
      if (data.result == 1) {
        this.items = data.detail.userProfileList;
        this.rows = data.detail.count;
        this.isBusy = false;
      }
    },
    handleSearch(e) {
      if (e.keyCode === 13) {
        this.filter.pageNo = 1;
        this.getList();
      }
    },
    pagination(Page) {
      this.filter.pageNo = Page;
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
      this.filter.pageNo = 1;
      this.filter.perPage = value;
      this.getList();
    }
  }
};
</script>