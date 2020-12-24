<template>
  <div>
    <b-row class="no-gutters bg-white-border">
      <b-col class="px-4 px-sm-5 py-4 mt-4">
        <b-row>
          <b-col md="4">
            <label class="main-label">User Review</label>
            <div class="d-flex">
              <h1 class="overall-num">{{userReviewDetail.reviewScore.ratingOverAll.rate}}</h1>
              <div class="ml-3">
                <span class="score overall-score">
                  <div class="score-wrap">
                    <span
                      class="stars-active"
                      :style="{'width': (userReviewDetail.reviewScore.ratingOverAll.percent)+'%'}"
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
                <span
                  class="f-14"
                >Total : {{userReviewDetail.reviewScore.ratingOverAll.count}} review(s)</span>
              </div>
            </div>
          </b-col>
          <b-col md="4" class="mt-3 mt-md-0">
            <div class="mt-1" v-if="userReviewDetail.reviewScore.ratingAttribute.length != 0">
              <span class="main-label f-14 ml-lg-3">Texture</span>
              <ProgressRating
                v-for="(item2, key2) in parseInt(5)"
                :key="key2"
                :name="`${5-key2} star${5-key2>1?'s':''}`"
                :data="userReviewDetail.reviewScore.ratingAttribute[0].star[5-key2-1][5-key2]"
              />
            </div>
          </b-col>
          <b-col md="4" class="mt-3 mt-md-0">
            <div class="mt-1" v-if="userReviewDetail.reviewScore.ratingAttribute.length != 0">
              <span class="main-label f-14 ml-lg-3">Result</span>
              <ProgressRating
                v-for="(item2, key2) in parseInt(5)"
                :key="key2"
                :name="`${5-key2} star${5-key2>1?'s':''}`"
                :data="userReviewDetail.reviewScore.ratingAttribute[1].star[5-key2-1][5-key2]"
              />
            </div>
          </b-col>
        </b-row>

        <b-row class="mt-4 mt-sm-5">
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
              <font-awesome-icon icon="filter" title="filter-btn" class="text-white mr-0 mr-sm-1" />
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
            :items="userReviewDetail.userReviewList.userReview"
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
                  <span
                    class="text-white f-16"
                  >Total : {{userReviewDetail.userReviewList.count}} Reviewed</span>
                </div>
              </div>
            </template>
            <template v-slot:cell(productRatingId)="data">
              <b-row>
                <b-col cols="6">
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

    <b-modal id="showImgModal" ref="showImgModal" hide-header hide-footer centered body-class="p-1">
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
  </div>
</template>

<script>
import InputSelect from "@/components/inputs/InputSelect";
import Vue from "vue";
import * as moment from "moment/moment";
import ProgressRating from "./ProgressRating";

export default {
  name: "ProductUserReview",
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
      categorySelectList: {},
      types: [],
      items: [],
      images: "",
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
      userReviewDetail: {
        reviewScore: {
          ratingOverAll: {
            id: 0,
            name: "",
            rate: 0.0,
            percent: 0.0,
            star: []
          },
          ratingAttribute: [
            {
              id: 1,
              name: "",
              rate: 0.0,
              percent: 0.0,
              count: 0,
              star: [
                {
                  "1": {
                    number: 0,
                    percent: 0.0
                  }
                },
                {
                  "2": {
                    number: 0,
                    percent: 0.0
                  }
                },
                {
                  "3": {
                    number: 0,
                    percent: 0.0
                  }
                },
                {
                  "4": {
                    number: 0,
                    percent: 0.0
                  }
                },
                {
                  "5": {
                    number: 0,
                    percent: 0.0
                  }
                }
              ]
            },
            {
              id: 2,
              name: "",
              rate: 0.0,
              percent: 0.0,
              count: 0,
              star: [
                {
                  "1": {
                    number: 0,
                    percent: 0.0
                  }
                },
                {
                  "2": {
                    number: 0,
                    percent: 0.0
                  }
                },
                {
                  "3": {
                    number: 0,
                    percent: 0.0
                  }
                },
                {
                  "4": {
                    number: 0,
                    percent: 0.0
                  }
                },
                {
                  "5": {
                    number: 0,
                    percent: 0.0
                  }
                }
              ]
            }
          ]
        },
        userReviewList: {
          count: 0,
          userReview: []
        }
      },
      userReviewData: {
        userReview: []
      }
    };
  },
  created: async function() {
    if (this.id != 0) {
      await this.getUserReview();
    }
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
        `${this.$baseUrl}/api/product/userReview/${this.id}`,
        null,
        this.$headers,
        this.filterUserReview
      );

      if (data.result == 1) {
        this.userReviewDetail = data.detail;
        this.rowsUserReview = data.detail.userReviewList.count;
        this.isBusyUserReview = false;
        this.checkRatingOverall();
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
          isComfirm: this.userReviewDetail.userReviewList.userReview[0].confirm
        };

        this.userReviewData.userReview = [];
        await this.userReviewData.userReview.push(userReviewDatas);

        setTimeout(async () => {
          let data = await this.$callApi(
            "post",
            `${this.$baseUrl}/api/product/saveUserReview`,
            null,
            this.$headers,
            this.userReviewData
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
    },
    checkRatingOverall() {
      let overallRate = this.userReviewDetail.reviewScore.ratingOverAll.percent;

      if (overallRate % 20 != 0) {
        if (overallRate > 0 && overallRate < 20) {
          this.userReviewDetail.reviewScore.ratingOverAll.percent = 10;
        } else if (overallRate > 20 && overallRate < 40) {
          this.userReviewDetail.reviewScore.ratingOverAll.percent = 30;
        } else if (overallRate > 40 && overallRate < 60) {
          this.userReviewDetail.reviewScore.ratingOverAll.percent = 50;
        } else if (overallRate > 60 && overallRate < 80) {
          this.userReviewDetail.reviewScore.ratingOverAll.percent = 70;
        } else if (overallRate > 80 && overallRate < 100) {
          this.userReviewDetail.reviewScore.ratingOverAll.percent = 90;
        } else {
        }
      }
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