<template>
  <CContainer class="min-vh-100">
    <CRow class="no-gutters px-3 px-sm-0">
      <CCol cols="6">
        <h1 class="mr-sm-4 header">CAREER</h1>
      </CCol>
      <CCol cols="6" class="text-right">
        <b-button v-b-toggle.sidebar-1 class="mr-2 btn-filter">
          <font-awesome-icon icon="filter" title="filter-btn" class="text-white mr-0 mr-sm-1" />
          <span class="d-none d-sm-inline">FILTER</span>
        </b-button>
        <router-link to="/career/details/0">
          <button type="button" class="btn btn-success button btn-mobile">
            <font-awesome-icon icon="plus" class="text-white d-sm-none" />
            <span class="d-none d-sm-block">CREATE NEW</span>
          </button>
        </router-link>
      </CCol>
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
                v-model="filter.status"
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

        <b-row class="no-gutters">
          <b-col>
            <div class="my-3">
              <p class="font-weight-bold mb-2">Sort By</p>
            </div>

            <b-form-select v-model="selected" :options="options" class="sortByDropdown"></b-form-select>
          </b-col>
        </b-row>

        <div class="text-center mt-3">
          <button
            type="button"
            class="btn bg-main-color text-white button"
            @click="getDataByStatus"
          >Submit</button>
        </div>
      </div>
    </b-sidebar>
    <div class="bg-white-border px-4 px-sm-5 pb-3 mt-3">
      <b-row class="no-gutters mt-3">
        <b-col lg="6">
          <b-input-group class="panel-input-serach">
            <b-form-input
              class="input-serach"
              placeholder="Position"
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
      </b-row>
      <b-row class="mt-3">
        <b-col>
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
            <template v-slot:cell(sortOrder)="data">
              <div v-if="data.item.sortOrder == 0">-</div>
              <div v-else>{{data.item.sortOrder}}</div>
            </template>
            <template v-slot:cell(updatedTime)="data">
              <span>{{ new Date(data.item.updatedTime) | moment($formatDate) }}</span>
            </template>
            <template v-slot:table-busy>
              <div class="text-center text-black my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong class="ml-2">Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(id)="data">
              <div class="d-flex justify-content-center">
                <router-link :to="'/career/details/'+data.item.id">
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
  name: "CareerIndex",
  data() {
    return {
      fields: [
        {
          key: "name",
          label: "Positions",
          class: "w-100px"
        },
        {
          key: "vacancies",
          label: "Vacancies"
        },
        {
          key: "updatedTime",
          label: "Update Date",
          class: "w-100px"
        },
        {
          key: "enabled",
          label: "Status"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      items: [],
      isBusy: false,
      rows: 0,
      filter: {
        perPage: 10,
        pageNo: 1,
        sortByOrderOrId: 0,
        status: []
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
  },
  methods: {
    getList: async function() {
      this.isBusy = true;
      this.filter.sortByOrderOrId = this.selected;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/career/list`,
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
      this.$refs.filterSidebar.hide(true);
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
          `${this.$baseUrl}/api/career/removeCareer/` + id,
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