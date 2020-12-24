<template>
  <div>
    <b-container class="container-box">
      <b-row class="no-gutters mb-2">
        <b-col>
          <h1 class="font-weight-bold text-uppercase">Customer Review</h1>
        </b-col>
      </b-row>

      <b-row class="no-gutters bg-white-border">
        <b-col class="px-4 px-sm-5 py-4">
          <b-row class>
            <b-col sm="4">
              <InputSelect
                class="mb-4"
                title="Texture"
                name="Texture"
                v-bind:options="rating"
                v-on:onDataChange="handleChangeTexture"
                v-model="filterUserReview.textureRate"
              />
            </b-col>
            <b-col sm="4">
              <InputSelect
                class="mb-4"
                title="Result"
                name="Result"
                v-bind:options="rating"
                v-on:onDataChange="handleChangeResult"
                v-model="filterUserReview.resultRate"
              />
            </b-col>
            <b-col sm="4" class="text-right">
              <b-button v-b-toggle.sidebar-1 class="btn-filter mb-3">
                <font-awesome-icon
                  icon="filter"
                  title="filter-btn"
                  class="text-white mr-0 mr-sm-1"
                />
                <span class="d-none d-sm-inline">FILTER</span>
              </b-button>
            </b-col>
          </b-row>

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
                  id="allUserReview"
                  :checked="checkAllUserReview"
                  @click="checkAllSelectUserReview()"
                  v-model="selectAllCbUserReview"
                />
                <label class="form-check-label" for="allUserReview">All</label>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      v-model="filterUserReview.status"
                      type="checkbox"
                      value="1"
                      id="review1"
                      @change="checkUserReviewStatusLength"
                    />
                    <label class="form-check-label" for="review1">Reviewed</label>
                  </div>
                </div>
                <div class="col-sm-6 mt-2 mt-sm-0">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      v-model="filterUserReview.status"
                      type="checkbox"
                      value="0"
                      id="review2"
                      @change="checkUserReviewStatusLength"
                    />
                    <label class="form-check-label" for="review2">Pending Review</label>
                  </div>
                </div>
              </div>
              <div class="text-center mt-3">
                <button
                  type="button"
                 class="btn bg-main-color text-white button"
                  @click="getDataByUserReviewStatus()"
                >Submit</button>
              </div>
            </div>
          </b-sidebar>

          <div>
            <b-table
              responsive="lg"
              striped
              :fields="userReviewFields"
              :items="userReviewDetail.dataList"
              :busy="isBusyUserReview"
              show-empty
              empty-text="No matching records found"
            >
              <template v-slot:head(productRatingId)="data">
                <div class="row">
                  <div class="col-6">
                    <span class="text-white f-16">{{data.label}}</span>
                  </div>
                  <div class="col-6 text-right">
                    <span class="text-white f-16">Total : {{userReviewDetail.count}} Reviewed</span>
                  </div>
                </div>
              </template>
              <template v-slot:cell(productRatingId)="data">
                <b-row>
                  <b-col cols="6">
                    <div class="mb-1">
                      <a
                        class="main-label"
                        :href="'/product/details/'+data.item.productId"
                        target="_blank"
                      >{{data.item.productName}}</a>
                    </div>
                    <a
                      class="main-label"
                      :href="'/user/details/'+data.item.reviewByUserGUID"
                      target="_blank"
                    >{{data.item.reviewBy}}</a>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <span>{{ new Date(data.item.updatedTime) | moment($formatDate) }}</span>
                  </b-col>
                </b-row>
                <div class="d-flex mb-1 mt-2">
                  <label class="f-14 main-label mr-2">Overall</label>
                  <div class="mr-4">
                    <span class="score">
                      <div class="score-wrap">
                        <span
                          class="stars-active"
                          :style="{'width': (data.item.overallRate * 20)+'%'}"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'star']"
                            v-for="(item,index) in 5"
                            v-bind:key="index"
                          />
                        </span>
                        <span class="stars-inactive">
                          <font-awesome-icon
                            :icon="['far', 'star']"
                            v-for="(item,index) in 5"
                            v-bind:key="index"
                          />
                        </span>
                      </div>
                    </span>
                  </div>
                  <label class="f-14 main-label mr-2">Texture</label>
                  <div class="mr-4">
                    <span class="score">
                      <div class="score-wrap">
                        <span
                          class="stars-active"
                          :style="{'width': (data.item.textureRate * 20)+'%'}"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'star']"
                            v-for="(item,index) in 5"
                            v-bind:key="index"
                          />
                        </span>
                        <span class="stars-inactive">
                          <font-awesome-icon
                            :icon="['far', 'star']"
                            v-for="(item,index) in 5"
                            v-bind:key="index"
                          />
                        </span>
                      </div>
                    </span>
                  </div>
                  <label class="f-14 main-label mr-2">Result</label>
                  <div class="mr-2">
                    <span class="score">
                      <div class="score-wrap">
                        <span
                          class="stars-active"
                          :style="{'width': (data.item.resultRate * 20)+'%'}"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'star']"
                            v-for="(item,index) in 5"
                            v-bind:key="index"
                          />
                        </span>
                        <span class="stars-inactive">
                          <font-awesome-icon
                            :icon="['far', 'star']"
                            v-for="(item,index) in 5"
                            v-bind:key="index"
                          />
                        </span>
                      </div>
                    </span>
                  </div>
                </div>
                <p>{{data.item.description}}</p>
                <hr />
                <div>
                  <div
                    class="user-review-img pointer"
                    v-bind:style="{ 'background-image': 'url(' + item.path + ')' }"
                    v-for="(item,index) in data.item.imageReview"
                    :key="index"
                    @click="seeImage(item.path)"
                  ></div>
                </div>
                <b-row class="mt-4">
                  <b-col cols="6">
                    <div></div>
                    <label class="font-weight-bold main-label mr-4">
                      Display Status
                      <span class="text-danger">*</span>
                    </label>
                    <div class="d-inline-block lh-30">
                      <b-form-checkbox
                        switch
                        v-model="data.item.confirm"
                        class="radio-active"
                        size="lg"
                        @change="changeReviewStatus(data.item,0)"
                      >
                        <span
                          class="ml-2 main-label lh-30"
                        >{{data.item.confirm ? 'Active' : 'Inactive' }}</span>
                      </b-form-checkbox>
                    </div>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <h5 v-if="data.item.review" class="font-weight-bold">Reviewed</h5>
                    <b-button
                      v-else
                      variant="outline-dark"
                      type="button"
                      class="rounded-0"
                      @click="changeReviewStatus(data.item,1)"
                    >Pending Review</b-button>
                  </b-col>
                </b-row>
              </template>
              <template v-slot:table-busy>
                <div class="text-center text-black my-2">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong class="ml-2">Loading...</strong>
                </div>
              </template>
            </b-table>
          </div>
          <b-row>
            <b-col class="form-inline justify-content-center justify-content-md-between">
              <b-pagination
                v-model="filterUserReview.pageNo"
                :total-rows="rowsUserReview"
                :per-page="filterUserReview.perPage"
                class="m-md-0"
                @change="pagination"
              ></b-pagination>
              <b-form-select
                v-model="filterUserReview.perPage"
                @change="hanndleChangePerpage"
                :options="pageOptions"
              ></b-form-select>
            </b-col>
          </b-row>
        </b-col>
      </b-row>

      <b-modal
        id="showImgModal"
        ref="showImgModal"
        hide-header
        hide-footer
        centered
        body-class="p-1"
      >
        <div class="modal-header border-0 p-0 m-0">
          <!-- <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('showImgModal')"
          >×</button>-->
        </div>
        <div>
          <b-container class="p-1">
            <b-row>
              <b-col>
                <div
                  class="square-box b-contain m-0 pb-0"
                  v-bind:style="{ 'background-image': 'url(' + previewImg + ')' }"
                ></div>
              </b-col>
            </b-row>
          </b-container>
        </div>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import InputSelect from "@/components/inputs/InputSelect";
import Vue from "vue";
import * as moment from "moment/moment";
import ProgressRating from "../product/components/ProgressRating";

export default {
  name: "UserReviewList",
  components: {
    InputSelect,
    ProgressRating
  },
  data() {
    return {
      id: this.$route.params.id,
      show: true,
      previewImg: "",
      productid: 0,
      i: 0,
      languageList: [],
      categorySelectList: {},
      types: [],
      items: [],
      images: "",
      languageActive: 1,
      isBusy: false,
      isBusyUserReview: false,
      isEdit: false,
      isSuccess: false,
      error: false,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      rowsUserReview: 0,
      checkAll: false,
      checkAllUserReview: false,
      selectAllCb: false,
      selectAllCbUserReview: false,
      isDisable: false,
      stars: [],
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ],
      sortByDefaultOptions: [
        { value: 0, text: "Please select an option" },
        { value: 1, text: "Sort Order" },
        { value: 2, text: "Created Time" }
      ],
      rating: [
        { value: 0, text: "All" },
        { value: 1, text: "1 Star" },
        { value: 2, text: "2 Stars" },
        { value: 3, text: "3 Stars" },
        { value: 4, text: "4 Stars" },
        { value: 5, text: "5 Stars" }
      ],
      userReviewFields: [
        {
          key: "productRatingId",
          label: "Review Details",
          class: "text-left px-4 w-100",
          thClass: "user-review-header px-4"
        }
      ],
      filterUserReview: {
        perPage: 10,
        pageNo: 1,
        status: [],
        textureRate: 0,
        resultRate: 0
      },
      userReviewDetail: []
    };
  },
  created: async function() {
    await this.getUserReview();
  },
  methods: {
    moment: function() {
      return moment();
    },
    pagination(Page) {
      this.filterUserReview.pageNo = Page;
      this.getUserReview();
    },
    hanndleChangePerpage(value) {
      this.filterUserReview.pageNo = 1;
      this.filterUserReview.perPage = value;
      this.getUserReview();
    },
    getDataByUserReviewStatus() {
      this.$refs.filterSidebar.hide(true);
      this.getUserReview();
    },
    checkUserReviewStatusLength() {
      if (this.filterUserReview.status.length == 2) {
        this.selectAllCbUserReview = true;
      } else {
        this.selectAllCbUserReview = false;
      }
    },
    checkAllSelectUserReview() {
      if (this.selectAllCbUserReview) {
        this.filterUserReview.status = [];
      } else {
        this.filterUserReview.status = [1, 0];
      }
    },
    getUserReview: async function() {
      this.isBusyUserReview = true;
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/customerReview/list`,
        null,
        this.$headers,
        this.filterUserReview
      );

      if (data.result == 1) {
        this.userReviewDetail = data.detail;
        this.rowsUserReview = data.detail.count;
        this.isBusyUserReview = false;
      }
    },
    seeImage(img) {
      this.previewImg = img;
      this.$refs["showImgModal"].show();
    },
    changeReviewStatus: async function(data, flag) {
      if (flag == 1 && !data.review) {
        data.review = true;
      }

      let id = data.productRatingId;
      let review = data.review;

      Vue.nextTick(async () => {
        let userReviewDatas = {
          productRatingId: id,
          isReview: review,
          isComfirm: data.confirm
        };

        setTimeout(async () => {
          let data = await this.$callApi(
            "post",
            `${this.$baseUrl}/api/customerReview/save`,
            null,
            this.$headers,
            userReviewDatas
          );

          if (data.result == 1) {
            await this.getUserReview();
          }
        }, 500);
      });
    },
    handleChangeTexture(value) {
      this.filterUserReview.textureRate = value;
      this.getUserReview();
    },
    handleChangeResult(value) {
      this.filterUserReview.resultRate = value;
      this.getUserReview();
    }
  }
};
</script>

<style scoped>
.overall-score {
  height: 22px;
}

.overall-num {
  font-size: 38px;
}

.b-contain {
  background-size: contain;
  padding-bottom: 50%;
}

.b-contain-square {
  background-size: contain;
  padding-top: 50%;
}

.stock-image {
  padding-bottom: 56.25%;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}

.status-txt {
  line-height: 25px;
}

.score {
  display: block;
  position: relative;
  overflow: hidden;
}

.score-wrap {
  display: inline-block;
  position: relative;
  height: 19px;
}

.score .stars-active {
  color: #c9b67e;
  position: relative;
  z-index: 10;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
}

.score .stars-inactive {
  color: #c9b67e;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-text-stroke: initial;
  /* overflow: hidden; */
}

.user-review-img {
  width: 24%;
  padding-top: 24%;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  display: inline-block;
  border: 2px dashed grey;
  margin: 3px;
}

.r-15 {
  right: 15px;
}

.lh-30 {
  line-height: 30px;
}

@media (max-width: 767px) {
  .user-review-img {
    width: 24%;
    padding-top: 24%;
    margin: calc(1% - 3px);
  }
}
</style>