<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol sm="6" class="text-center text-sm-left">
        <h1 class="mr-sm-4">BEAUTY TIPS MANAGEMENT</h1>
      </CCol>
      <CCol sm="6" class="text-center text-sm-right">
        <b-dropdown id="dropdown-form" right ref="dropdown" class="m-2 btn-filter" no-flip="">
          <template v-slot:button-content>
            <font-awesome-icon icon="filter" class="mr-2" />FILTER
          </template>

          <div>
            <p class="font-weight-bold mb-2">Highlight</p>
            <div class="form-check">
              <input
                class="form-check-input"
                v-model="isHighlight"
                type="checkbox"
                id="highlightCb"
              />
              <label class="form-check-label" for="highlightCb">Show only highlight</label>
            </div>
          </div>

          <div>
            <p class="font-weight-bold mt-3 mb-2">Status</p>
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
        <router-link to="/beautytips/details/0">
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
              placeholder="Beauty Tips Name"
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
            :fields="fields"
            :items="items"
            :busy="isBusy"
            show-empty
            empty-text="No matching records found"
          >
            <template v-slot:cell(imageUrl)="data">
              <div
                class="image"
                v-bind:style="{ 'background-image': 'url(' + data.item.imageUrl + ')' }"
              ></div>
            </template>
             <template v-slot:cell(name)="data">
              <p class="m-0 font-weight-bold">{{data.item.name}}</p>
              <p class="m-0">{{data.item.shortDescription}}</p>
            </template>
            <template v-slot:cell(updatedTime)="data">
              <span>{{ new Date(data.item.updatedTime) | moment($formatDate) }}</span>
            </template>
            <template v-slot:cell(enabled)="data">
              <div v-if="data.item.enabled == true" class="text-success">Active</div>
              <div v-else class="text-danger">Inactive</div>
            </template>
            <template v-slot:cell(sortOrder)="data">
              <div v-if="data.item.sortOrder == 0">-</div>
              <div v-else>{{data.item.sortOrder}}</div>
            </template>
            <template v-slot:cell(isHighlight)="data">
              <div v-if="data.item.isHighlight == true" class="text-success">Yes</div>
              <div v-else class="text-danger">No</div>
            </template>
            <template v-slot:cell(id)="data">
              <div class="d-flex justify-content-center">
                <router-link :to="'/beautytips/details/'+data.item.id">
                  <b-button variant="link" class="text-warning px-1 py-0">
                    <font-awesome-icon icon="pencil-alt" title="Edit"/>
                  </b-button>
                </router-link>
                <b-button
                  variant="link"
                  class="text-danger px-1 py-0"
                  @click="deleteData(data.item.id)"
                >
                  <font-awesome-icon icon="trash-alt" title="Delete"/>
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
            v-model="filter.pageno"
            :total-rows="rows"
            :per-page="filter.perpage"
            class="m-md-0"
            @change="pagination"
          ></b-pagination>
          <b-form-select
            @change="hanndleChangePerpage"
            v-model="filter.perpage"
            :options="pageOptions"
          ></b-form-select> 
        </b-col>
      </b-row>
    </div>
  </CContainer>
</template>

<script>
export default {
  name: "BeautyTipsIndex",
  data() {
    return {
      fields: [
        {
          key: "imageUrl",
          label: "Thumbnail",
          tdClass: "w-200"
        },
        {
          key: "name",
          label: "Beauty Tips Name",
          class: "w-200"
        },
        {
          key: "updatedTime",
          label: "Update Date",
          class: "text-center w-100px"
        },
        {
          key: "sortOrder",
          label: "Sort Order",
          tdClass: "text-center"
        },
        {
          key: "isHighlight",
          label: "Highlight",
          tdClass: "text-center"
        },
        {
          key: "enabled",
          label: "Status",
          tdClass: "text-center"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      items: [],
      itemsHighlight: [],
      filterCheckbox: [],
      isBusy: false,
      isHighlight: false,
      rows: 0,
      rowsHighlight: 0,
      checkAll: false,
      selectAllCb: false,
      selected: 0,
      options: [
        { value: 0, text: "Please select an option" },
        { value: 1, text: "Sort Order" },
        { value: 2, text: "Created Time" }
      ],
      filter: {
        status: [],
        search: "",
        perpage: 10,
        pageno: 1,
        SortByOrderOrId: 0,
        HighlightFilter: 0
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
      this.filter.SortByOrderOrId = this.selected;

      if (this.isHighlight) {
        this.filter.HighlightFilter = 1;
      } else {
        this.filter.HighlightFilter = 0;
      }

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/blog/list`,
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
    hanndleChangePerpage(value) {
      this.filter.pageno = 1;
      this.filter.perpage = value;
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
    deleteData: async function(id) {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/blog/remove/` + id,
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

<style scoped>
.image {
  width: 100%;
  padding-top: 50%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>