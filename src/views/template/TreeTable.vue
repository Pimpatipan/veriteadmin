<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol lg="6" class="text-center text-lg-left">
        <h1 class="mr-sm-4">Tree</h1>
      </CCol>
    </CRow>
    <div class="bg-white-border px-4 px-sm-5 py-4 mt-4">
      <b-row>
        <b-col class="mt-4">
          <div class="text-right mb-3">
            <b-button @click="parentList = parents">Expand all</b-button>
            <b-button class="ml-2" @click="parentList = []">Collapse all</b-button>
          </div>
          <!-- <pre>{{parents}}</pre>
          <pre>{{parentList}}</pre> -->
          <table class="table table-striped table-hover table-responsive-sm">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Number Of Category</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <template>
                <tr>
                  <td class="text-left">
                    <b-button
                      variant="toggle-tree"
                      v-if="parentList.indexOf(items.id) < 0"
                      @click="addParent(items.id)"
                      ref="expandAll"
                    >
                      <font-awesome-icon icon="plus" />
                    </b-button>
                    <b-button variant="toggle-tree" v-else @click="deleteParent(items.id)">
                      <font-awesome-icon icon="minus" />
                    </b-button>
                    <span class="pl-3">{{items.name}}</span>
                  </td>
                  <td>{{items.sub.length}}</td>
                  <td>
                    <div class="d-flex justify-content-center">
                      <router-link :to="'/test/'+items.id">
                        <b-button variant="link" class="f-blue px-1 py-0">
                          <font-awesome-icon icon="plus" title="Add" />
                        </b-button>
                      </router-link>
                      <router-link :to="'/test/'+items.id">
                        <b-button variant="link" class="text-warning px-1 py-0">
                          <font-awesome-icon icon="pencil-alt" title="Edit" />
                        </b-button>
                      </router-link>
                      <b-button variant="link" class="text-danger px-1 py-0" disabled>
                        <font-awesome-icon icon="trash-alt" title="Delete" />
                      </b-button>
                    </div>
                  </td>
                </tr>
                <template v-for="(item2, key2) in items.sub">
                  <tr :key="`lv2-${key2}`" v-if="parentList.indexOf(items.id) > -1">
                    <td class="text-left">
                      <div class="pl-lv2">
                        <b-button
                          variant="toggle-tree"
                          v-if="parentList.indexOf(item2.id) < 0"
                          @click="addParent(item2.id)"
                          ref="expandAll"
                        >
                          <font-awesome-icon icon="plus" />
                        </b-button>
                        <b-button variant="toggle-tree" v-else @click="deleteParent(item2.id)">
                          <font-awesome-icon icon="minus" />
                        </b-button>
                        <span class="pl-3">{{item2.name}}</span>
                      </div>
                    </td>
                    <td>{{item2.sub.length}}</td>
                    <td>
                      <div class="d-flex justify-content-center">
                        <router-link :to="'/test/'+item2.id">
                          <b-button variant="link" class="f-blue px-1 py-0">
                            <font-awesome-icon icon="plus" title="Add" />
                          </b-button>
                        </router-link>
                        <router-link :to="'/test/'+item2.id">
                          <b-button variant="link" class="text-warning px-1 py-0">
                            <font-awesome-icon icon="pencil-alt" title="Edit" />
                          </b-button>
                        </router-link>
                        <b-button variant="link" class="text-danger px-1 py-0">
                          <font-awesome-icon icon="trash-alt" title="Delete" />
                        </b-button>
                      </div>
                    </td>
                  </tr>
                  <template v-for="(item3, key3) in item2.sub">
                    <tr
                      :key="`lv2-${key2}-lv3-${key3}`"
                      v-if="parentList.indexOf(item2.id) > -1"
                    >
                      <td class="text-left">
                        <span class="pl-lv3">{{item3.name}}</span>
                      </td>
                      <td>
                      </td>
                      <td>
                        <div class="d-flex justify-content-center">
                          <b-button variant="link" disabled class="f-blue px-1 py-0">
                            <font-awesome-icon icon="plus" title="Add" />
                          </b-button>
                        <router-link :to="'/test/'+item3.id">
                          <b-button variant="link" class="text-warning px-1 py-0">
                            <font-awesome-icon icon="pencil-alt" title="Edit" />
                          </b-button>
                        </router-link>
                        <b-button variant="link" class="text-danger px-1 py-0">
                          <font-awesome-icon icon="trash-alt" title="Delete" />
                        </b-button>
                      </div>
                      </td>
                    </tr>
                  </template>
                </template>
              </template>
            </tbody>
          </table>
        </b-col>
      </b-row>
      <!-- <b-row>
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
      </b-row>-->
    </div>
  </CContainer>
</template>

<script>
import axios from "axios";
import * as moment from "moment/moment";

export default {
  name: "Index",
  components: {
  },
  data() {
    return {
      fields: [
        {
          key: "id",
          label: "Id",
          class: "w-100px"
        },
        {
          key: "name",
          label: "Name",
          class: "w-100px"
        },
        {
          key: "sub",
          label: "Number Of Product",
          class: "w-100px"
        },
        {
          key: "action",
          label: "Action"
        }
      ],
      items: {
        id: 0,
        name: "All",
        sub: [
          {
            id: 1,
            name: "Category 1",
            sub: [
              {
                id: 10,
                name: "Category 10",
                sub: []
              },
              {
                id: 11,
                name: "Category 11",
                sub: []
              },
              {
                id: 12,
                name: "Category 12",
                sub: []
              }
            ]
          },
          {
            id: 2,
            name: "Category 2",
            sub: [
              {
                id: 20,
                name: "Category 20",
                sub: []
              },
              {
                id: 21,
                name: "Category 21",
                sub: []
              },
              {
                id: 22,
                name: "Category 22",
                sub: []
              }
            ]
          },
          {
            id: 3,
            name: "Category 3",
            sub: [
              {
                id: 30,
                name: "Category 30",
                sub: []
              },
              {
                id: 31,
                name: "Category 31",
                sub: []
              },
              {
                id: 32,
                name: "Category 32",
                sub: []
              }
            ]
          },
          {
            id: 4,
            name: "Category 4",
            sub: [
              {
                id: 40,
                name: "Category 40",
                sub: []
              },
              {
                id: 41,
                name: "Category 41",
                sub: []
              },
              {
                id: 42,
                name: "Category 42",
                sub: []
              }
            ]
          }
        ]
      },
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
      ],
      parentList: [],
      parents: []
    };
  },
  created: async function() {
    this.parents.push(this.items.id);
    this.items.sub.forEach(ele => {
      this.parents.push(ele.id);
      if (ele.sub.length > 0) {
        ele.sub.forEach(ele => {
          this.parents.push(ele.id);
        });
      }
    });
  },
  methods: {
    addParent(ref) {
      // console.log("addParent", ref);
      this.parentList.push(ref);

      console.log(this.parentList)
    },
    deleteParent(ref) {
      // console.log("deleteParent", ref);
      var index = this.parentList.indexOf(ref);
      if (index !== -1) this.parentList.splice(index, 1);
    },
    getList: async function() {
      this.isBusy = true;

      this.filter.verified = [];

      if (this.isVerified) {
        this.filter.verified.push(1);
      } else {
        this.filter.verified = [];
      }

      this.isBusy = false;

      //   let data = await this.$callApi(
      //     "post",
      //     `${this.$baseUrl}/api/customer/list`,
      //     null,
      //     this.$headers,
      //     this.filter
      //   );
      //   if (data.result == 1) {
      //     this.items = data.detail.userProfileList;
      //     this.rows = data.detail.count;
      //     this.isBusy = false;

      //     if (this.items.firstname == null || this.items.lastname == null) {
      //       this.isNameNull == true;
      //     } else {
      //       this.isNameNull == false;
      //     }
      //   }
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
    }
  }
};
</script>
<style scoped>
.pl-lv2 {
  padding-left: 50px !important;
}
.pl-lv3 {
  padding-left: 120px !important;
}
</style>