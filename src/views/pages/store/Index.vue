<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol sm="6" class="text-center text-sm-left">
        <h1 class="mr-sm-4">STORE MANAGEMENT</h1>
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

          <div>
            <p class="font-weight-bold mb-2 mt-3">Branch Type</p>
          </div>

          <div class="row">
            <div class="col-6" v-for="branchType in filterList" :key="branchType.id">
              <div class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="branchType.id"
                  v-model="filter.branchTypeId"
                  checked="checked"
                  :id="'type-'+branchType.id"
                />
                <label class="form-check-label" :for="'type-'+branchType.id">{{branchType.name}}</label>
              </div>
            </div>
          </div>

          <div class="text-center mt-3">
            <button type="button" class="btn btn-primary button" @click="getDataByStatus()">Submit</button>
          </div>
        </b-dropdown>
        <router-link to="/store/details/0">
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
              placeholder="Store Name, Address"
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
        <b-col class="mt-4">
          <b-table
            responsive
            striped
            hover
            :fields="fields"
            :items="items"
            :busy="isBusy"
            show-empty
            empty-text="No matching records found"
          >
            <template v-slot:cell(enabled)="data">
              <div v-if="data.item.enabled == 1" class="text-success">Active</div>
              <div v-else class="text-danger">Inactive</div>
            </template>
            <template v-slot:cell(id)="data">
              <div class="d-flex justify-content-center">
                <router-link :to="'/store/details/'+data.item.id">
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
            <template v-slot:cell(sortOrder)="data">
              <div v-if="data.item.sortOrder == 0">-</div>
              <div v-else>{{data.item.sortOrder}}</div>
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
  name: "StoreIndex",
  data() {
    return {
      fields: [
        {
          key: "name",
          label: "Store Name"
        },
        {
          key: "address",
          label: "Address",
          class: "w-200"
        },
        {
          key: "operationTime",
          label: "Operation Time",
          class: "w-100px"
        },
        {
          key: "enabled",
          label: "Status",
          class: "w-100px"
        },
        {
          key: "sortOrder",
          label: "Sort Order"
        },
        {
          key: "id",
          label: "Action",
          class: "w-100px"
        }
      ],
      items: [],
      filterList: [],
      isBusy: false,
      rows: 0,
      filter: {
        perPage: 10,
        pageNo: 1,
        status: [],
        search: "",
        sortByOrderOrId: 0,
        branchTypeId: []
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ],
      checkAll: false,
      selectAllCb: false,
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
    await this.getFilter();
  },
  methods: {
    getList: async function() {
      this.isBusy = true;
      this.filter.sortByOrderOrId = this.selected;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/branch/list`,
        null,
        this.$headers,
        this.filter
      );
      if (data.result == 1) {
        this.items = data.detail.dataList;
        this.rows = data.detail.count;
        this.isBusy = false;
      }
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
    },
    deleteData: async function(id) {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/branch/removeBranch/` + id,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          location.reload();
        }
      }
    }
  }
};
</script>