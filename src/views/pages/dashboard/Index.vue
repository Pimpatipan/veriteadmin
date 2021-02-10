<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col cols="6" sm="8">
            <h1
              class="font-weight-bold text-uppercase mt-0 mt-sm-2 float-left float-sm-none"
            >Dashboard</h1>
          </b-col>
          <b-col cols="6" sm="4" class="text-right">
            <b-button v-b-toggle.sidebar-1 class="mr-2 btn-filter">
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
            <div class="row mt-3 mt-sm-0">
              <div class="col-6">
                <p class="font-weight-bold mb-2">Valid from</p>
                <datetime
                  placeholder="Please select date"
                  class="date-filter bg-white"
                  v-model="datefilter.startDate"
                  format="dd MMM yyyy"
                >
                  <!-- <template slot="button-confirm">
                    <span @click="OnChangeDate">Ok</span>
                  </template>-->
                </datetime>
              </div>
              <div class="col-6">
                <p class="font-weight-bold mb-2">Valid to</p>
                <datetime
                  placeholder="Please select date"
                  class="date-filter bg-white"
                  v-model="datefilter.endDate"
                  format="dd MMM yyyy"
                >
                  <!-- <template slot="button-confirm">
                    <span @click="OnChangeDate">Ok</span>
                  </template>-->
                </datetime>
              </div>
            </div>

            <div class="text-center mt-4">
              <button
                type="button"
                class="btn bg-main-color text-white button"
                @click="OnChangeDate"
              >Submit</button>
            </div>
          </div>
        </b-sidebar>

        <b-row class="mt-3">
          <b-col sm="6" md="3">
            <div class="card text-white bg-purple">
              <div
                class="card-body card-body pb-0 d-flex justify-content-between align-items-start"
              >
                <div class="w-100">
                  <h3 class="txt-ellipsis">
                    <font-awesome-icon icon="clipboard" class="mr-2" />Order
                  </h3>
                  <p class="txt-ellipsis">{{dateText}}</p>
                </div>
              </div>
              <div class="c-chart-wrapper mx-3">
                <h3 class="txt-ellipsis">{{dashboard.order | numeral('0,0')}} Order(s)</h3>
              </div>
            </div>
          </b-col>
          <b-col sm="6" md="3">
            <div class="card text-white bg-gradient-primary">
              <div
                class="card-body card-body pb-0 d-flex justify-content-between align-items-start"
              >
                <div class="w-100">
                  <h3 class="txt-ellipsis">
                    <font-awesome-icon icon="hand-holding-usd" class="mr-2" />Revenue
                  </h3>
                  <p class="txt-ellipsis">{{dateText}}</p>
                </div>
              </div>
              <div class="c-chart-wrapper mx-3">
                <h3 class="txt-ellipsis">{{ dashboard.revenue | numeral('0,0.00') }} Baht</h3>
              </div>
            </div>
          </b-col>
          <b-col sm="6" md="3">
            <div class="card text-white bg-gradient-info">
              <div
                class="card-body card-body pb-0 d-flex justify-content-between align-items-start"
              >
                <div class="w-100">
                  <h3 class="txt-ellipsis">
                    <font-awesome-icon icon="user" class="mr-2" />New/Total Customer
                  </h3>
                  <p class="txt-ellipsis">{{dateText}}</p>
                </div>
              </div>
              <div class="c-chart-wrapper mx-3">
                <h3
                  class="txt-ellipsis"
                >{{dashboard.newCustomer | numeral('0,0') }}/{{dashboard.totalCustomer | numeral('0,0')}} User(s)</h3>
              </div>
            </div>
          </b-col>
          <b-col sm="6" md="3">
            <div class="card text-white bg-gradient-warning">
              <div
                class="card-body card-body pb-0 d-flex justify-content-between align-items-start"
              >
                <div class="w-100">
                  <h3 class="txt-ellipsis">
                    <font-awesome-icon icon="box" class="mr-2" />Quantity
                  </h3>
                  <p class="txt-ellipsis">{{dateText}}</p>
                </div>
              </div>
              <div class="c-chart-wrapper mx-3">
                <h3 class="txt-ellipsis">{{ dashboard.quantity | numeral('0,0') }} Product(s)</h3>
              </div>
            </div>
          </b-col>
        </b-row>

        <b-row class="mt-3 no-gutters">
          <b-col class="bg-white p-4">
            <h3 class="text-body font-weight-bold">Revenue Of Date</h3>
            <p
              class="text-body mb-4"
            >{{ datefilter.startDate | moment($formatDate) }} - {{ datefilter.endDate | moment($formatDate) }}</p>
            <div>
              <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoadingData" />
              <BarChartData :xData="graphData.xData" :yData="graphData.yData"></BarChartData>
            </div>
          </b-col>
        </b-row>

        <b-row class="mt-3">
          <b-col md="6">
            <div class="p-4 bg-white h-100">
              <h3 class="text-body mb-4 font-weight-bold">Recent Order</h3>
              <div class="table-box">
                <b-table
                  striped
                  hover
                  :busy="isBusy"
                  :items="items"
                  :fields="fields"
                  show-empty
                  empty-text="No matching records found"
                >
                  <template v-slot:cell(createdTime)="data">
                    <span>{{ new Date(data.item.createdTime) | moment($formatDate) }}</span>
                  </template>
                </b-table>
              </div>
            </div>
          </b-col>
          <b-col md="6">
            <div class="p-4 bg-white h-100">
              <h3 class="text-body mb-4 font-weight-bold">Order Status</h3>
              <div>
                <img src="/img/loading.svg" class="loading" alt="loading" v-if="isLoadingData" />
                <PieChartData :data="orderStatus"></PieChartData>
              </div>
            </div>
          </b-col>
        </b-row>

        <b-row class="mt-3">
          <b-col md="6">
            <div class="p-4 bg-white">
              <h3 class="text-body mb-4 font-weight-bold">Recent Question</h3>
              <div class="table-box">
                <b-table
                  striped
                  hover
                  responsive
                  :items="itemsQuestion"
                  :fields="fields2"
                  :busy="isBusy"
                  show-empty
                  empty-text="No matching records found"
                >
                  <template v-slot:cell(createdTime)="data">
                    <span>{{ new Date(data.item.createdTime) | moment($formatDate) }}</span>
                  </template>
                  <template v-slot:cell(answerStatus)="data">
                    <div v-if="data.item.answerStatus == true" class="text-success">Answer</div>
                    <div v-else class="text-warning">Wait for answer</div>
                  </template>
                </b-table>
              </div>
            </div>
          </b-col>
          <b-col md="6">
            <div class="p-4 bg-white">
              <h3 class="text-body mb-4 font-weight-bold">Recent Review</h3>
              <div class="table-box">
                <b-table
                  striped
                  hover
                  responsive
                  :items="itemsReview"
                  :fields="fields3"
                  :busy="isBusy"
                  show-empty
                  empty-text="No matching records found"
                >
                  <template v-slot:cell(createdTime)="data">
                    <span>{{ new Date(data.item.createdTime) | moment($formatDate) }}</span>
                  </template>
                  <template v-slot:cell(description)="data">
                    <div v-if="data.item.description == '' || data.item.description == null">-</div>
                    <div v-else>{{data.item.description}}</div>
                  </template>
                  <template v-slot:cell(review)="data">
                    <div v-if="data.item.review == true" class="text-success">Reviewed</div>
                    <div v-else class="text-warning">Wait for review</div>
                  </template>
                </b-table>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import { Bar } from "vue-chartjs";
import PieChartData from "./components/PieChart";
import BarChartData from "./components/BarChart";

export default {
  name: "Dashboard",
  components: { PieChartData, BarChartData },
  data() {
    let tempDate = new Date();
    let tempEndDate = tempDate.toISOString();
    tempDate.setMonth(tempDate.getMonth() - 1);
    let tempStartDate = tempDate.toISOString();

    return {
      items: [],
      itemsQuestion: [],
      itemsReview: [],
      dateText: "",
      rows: 0,
      rowsQuestion: 0,
      rowsReview: 0,
      dashboard: [],
      orderStatus: [],
      isBusy: false,
      isLoadingData: false,
      visible: true,
      revenueBarchart: [],
      fields: [
        {
          key: "customerName",
          label: "Customer Name"
        },
        {
          key: "orderId",
          label: "Order ID"
        },
        {
          key: "statusName",
          label: "Status"
        },
        {
          key: "createdTime",
          label: "Order Time"
        }
      ],
      fields2: [
        {
          key: "customerName",
          label: "Customer Name"
        },
        {
          key: "question",
          label: "Question",
          class: "w-100px"
        },
        {
          key: "productName",
          label: "Product Name",
          class: "w-100px"
        },
        {
          key: "createdTime",
          label: "Created Time"
        },
        {
          key: "answerStatus",
          label: "Answer Status",
          class: "w-100px"
        }
      ],
      fields3: [
        {
          key: "customerName",
          label: "Customer Name"
        },
        {
          key: "description",
          label: "Review"
        },
        {
          key: "overallRate",
          label: "Overall Rating"
        },
        {
          key: "createdTime",
          label: "Created Time"
        },
        {
          key: "review",
          label: "Review Status"
        }
      ],
      datefilter: {
        startDate: tempStartDate,
        endDate: tempEndDate
      },
      graphData: {
        xData: [],
        yData: []
      },
      screenSize: 0
    };
  },
  created: async function() {
    await this.getData();
    this.dateText = "Last 30 Days";
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenSize = window.innerWidth;
      if (this.screenSize > 575) this.visible = true;
      else this.visible = false;
    },
    OnChangeDate: async function() {
      this.$refs.filterSidebar.hide(true);
      await this.getData();
      this.dateText =
        this.$moment(this.datefilter.startDate).format(this.$formatDate) +
        " - " +
        this.$moment(this.datefilter.endDate).format(this.$formatDate);
    },
    getData: async function() {
      this.isBusy = true;
      this.isLoadingData = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/dashboard`,
        null,
        this.$headers,
        this.datefilter
      );

      if (data.result == 1) {
        this.dashboard = data.detail;
      }

      let datas = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/dashboard/orderStatus`,
        null,
        this.$headers,
        this.datefilter
      );

      if (datas.result == 1) {
        this.orderStatus = datas.detail;
      }

      let bardata = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/dashboard/revenueBarchar`,
        null,
        this.$headers,
        this.datefilter
      );

      if (bardata.result == 1) {
        this.graphData.yData = bardata.detail.data;

        this.graphData.xData = [];
        bardata.detail.date.forEach((element, index) => {
          this.graphData.xData[index] = this.$moment(element).format("DD MMM");
        });
      }

      this.isLoadingData = false;

      let order = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/dashboard/recentOrder`,
        null,
        this.$headers,
        this.datefilter
      );

      if (order.result == 1) {
        this.items = order.detail.order;
        this.isBusy = false;
      }

      let question = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/dashboard/recentQuestion`,
        null,
        this.$headers,
        this.datefilter
      );

      if (question.result == 1) {
        this.itemsQuestion = question.detail.question;
        this.isBusy = false;
      }

      let reviews = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/dashboard/recentReview`,
        null,
        this.$headers,
        this.datefilter
      );

      if (reviews.result == 1) {
        this.itemsReview = reviews.detail.review;
        this.isBusy = false;
      }
    }
  }
};
</script>

<style scoped>
.bg-purple {
  background-image: linear-gradient(to bottom left, #b855fd, #6d41fa);
}

.txt-ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.c-chart-wrapper {
  height: 70px;
}

.table-box {
  max-height: 320px;
  overflow: auto;
}

.btn-filter-mobile,
.btn-filter-mobile:hover {
  background-color: #16274a;
}
</style>