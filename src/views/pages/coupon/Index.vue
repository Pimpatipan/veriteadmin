<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol sm="6" class="text-center text-sm-left">
        <h1 class="mr-sm-4">COUPON MANAGEMENT</h1>
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

          <div class="row">
            <div class="col-6">
              <p class="font-weight-bold my-2">Valid from</p>
              <datetime
                v-model="filter.startDate"
                placeholder="Please select date"
                class="date-filter"
              ></datetime>
            </div>
            <div class="col-6">
              <p class="font-weight-bold my-2">Valid to</p>
              <datetime
                v-model="filter.endDate"
                placeholder="Please select date"
                class="date-filter"
              ></datetime>
            </div>
          </div>

          <p class="text-danger text-center my-3" v-if="error">Please enter correct date</p>
          <div class="text-center mt-3">
            <button type="button" class="btn btn-primary button" @click="getDataByStatus()">Submit</button>
          </div>
        </b-dropdown>
        <router-link to="/coupon/details/0">
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
              placeholder="Name, Code"
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
        <b-col lg="6" class="text-center text-sm-right"></b-col>
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
            <template v-slot:cell(discount)="data">
              <div v-if="data.item.discountTypeId == 1">{{data.item.discount}} {{data.item.discountTypeName}}</div>
              <div v-else-if="data.item.discountTypeId == 2">{{data.item.discount}}%</div>
              <div v-else>Free Product</div>
            </template>
            <template v-slot:cell(startDate)="data">
              <span>{{ new Date(data.item.startDate) | moment($formatDate) }} - {{ new Date(data.item.endDate) | moment($formatDate) }}</span>
            </template>
            <template v-slot:cell(quantity)="data">
              <div>{{data.item.remain}}/{{data.item.quantity}}</div>
            </template>
             <template v-slot:cell(enabled)="data">
              <div v-if="data.item.enabled == true" class="text-success">Active</div>
              <div v-else class="text-danger">Inactive</div>
            </template>
            <template v-slot:cell(id)="data">
              <div class="d-flex justify-content-center">
                <router-link :to="'/coupon/details/'+data.item.id">
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
            v-model="filter.pageNo"
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
    </div>
  </CContainer>
</template>

<script>
export default {
  name: "CouponIndex",
  data() {
    return {
      fields: [
        {
          key: "name",
          label: "Name",
          class: "w-100px"
        },
        {
          key: "prefix",
          label: "Code",
          class: "w-100px"
        },
        {
          key: "discount",
          label: "Discount",
          class: "w-100px"
        },
        {
          key: "startDate",
          label: "Valid From-To",
          class: "w-100px"
        },
        {
          key: "quantity",
          label: "Usage"
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
      error: false,
      rows: 0,
      filter: {
        search: "",
        status: [],
        pageNo: 1,
        perpage: 10,
        startDate: null,
        endDate: null
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
      selected: 0
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
        `${this.$baseUrl}/api/coupon/list`,
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
      if (new Date(this.filter.endDate) < new Date(this.filter.startDate)) {
        this.error = true;
        return;
      }

      this.$refs.dropdown.hide(true);
      this.error = false;
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
          `${this.$baseUrl}/api/coupon/remove/` + id,
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